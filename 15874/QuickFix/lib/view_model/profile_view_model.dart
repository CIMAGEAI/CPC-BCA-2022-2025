import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class ProfileViewModel extends ChangeNotifier {
  String _userName = "User";
  String _userEmail = "example@example.com";

  String get userName => _userName;
  String get userEmail => _userEmail;

  Future<void> fetchProfileData() async {
    try {
      final uid = FirebaseAuth.instance.currentUser?.uid;
      if (uid != null) {
        final snapshot =
        await FirebaseFirestore.instance.collection('users').doc(uid).get();
        if (snapshot.exists) {
          final data = snapshot.data();
          _userName = data?['name'] ?? "User";
          _userEmail = data?['email'] ?? "example@example.com";
          notifyListeners();
        }
      }
    } catch (e) {
      debugPrint("Error fetching profile data: $e");
    }
  }

  Future<void> logout(BuildContext context) async {
    try {
      await FirebaseAuth.instance.signOut();
      notifyListeners();
    } catch (e) {
      debugPrint("Logout error: $e");
    }
  }
}
