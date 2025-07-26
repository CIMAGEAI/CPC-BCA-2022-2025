import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  //  Register user with email & password
  Future<Map<String, dynamic>> registerUser({
    required String name,
    required String email,
    required String password,
    required int userType,
  }) async {
    try {
      UserCredential cred = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      await _firestore.collection('users').doc(cred.user!.uid).set({
        'name': name,
        'email': email,
        'userType': userType, // 0 = user, 1 = vendor
        'uid': cred.user!.uid,
        'photoUrl': '',
      });

      return {'success': true};
    } on FirebaseAuthException catch (e) {
      return {'success': false, 'message': e.message ?? 'An error occurred'};
    }
  }

  //  Email/password login
  Future<Map<String, dynamic>> signInUser(String email, String password) async {
    try {
      UserCredential cred = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );

      DocumentSnapshot userDoc =
      await _firestore.collection('users').doc(cred.user!.uid).get();

      if (userDoc.exists) {
        int userType = userDoc['userType'] ?? 0;
        return {'success': true, 'userType': userType};
      } else {
        return {'success': false, 'message': 'User data not found'};
      }
    } on FirebaseAuthException catch (e) {
      return {'success': false, 'message': e.message ?? 'Login failed'};
    }
  }

  //  Google Sign-in with Firestore sync
  Future<Map<String, dynamic>> signInWithGoogle() async {
    try {
      final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();
      if (googleUser == null) return {'success': false, 'message': 'Google sign-in cancelled'};

      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;

      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final userCredential = await _auth.signInWithCredential(credential);
      final user = userCredential.user;

      // Check if user document exists
      final userDoc = await _firestore.collection('users').doc(user!.uid).get();

      if (!userDoc.exists) {
        await _firestore.collection('users').doc(user.uid).set({
          'name': user.displayName ?? 'User',
          'email': user.email ?? '',
          'photoUrl': user.photoURL ?? '',
          'uid': user.uid,
          'userType': 0, // default to customer
        });
      }

      return {'success': true};
    } catch (e) {
      return {'success': false, 'message': 'Google sign-in failed: $e'};
    }
  }

  // Sign out
  Future<void> signOut() async {
    await _auth.signOut();
    await GoogleSignIn().signOut();
  }
}
