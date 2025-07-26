import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;

class HomeViewModel extends ChangeNotifier {
  // Bottom nav state
  int _currentIndex = 0;
  int get currentIndex => _currentIndex;

  // Lottie animations for the carousel
  final List<String> _animation = [
    'assets/lottie/Cleaning.json',
    'assets/lottie/Electrician.json',
    'assets/lottie/Happy Mechanic.json',
  ];
  List<String> get animationList => _animation;

  // Search bar controller
  final TextEditingController searchController = TextEditingController();

  // Voice recognition state
  bool _isListening = false;
  bool get isListening => _isListening;

  // Logged-in user data
  String _userName = "User";
  String get userName => _userName;

  String _userEmail = "";
  String get userEmail => _userEmail;

  String _profileImage = "";
  String get profileImage => _profileImage;

  // Speech-to-text
  final stt.SpeechToText _speech = stt.SpeechToText();

  // Update bottom navigation bar index
  void updateNavIndex(int index) {
    _currentIndex = index;
    notifyListeners();
  }

  void setUserName(String name) {
    _userName = name;
    notifyListeners();
  }

  void setUserEmail(String email) {
    _userEmail = email;
    notifyListeners();
  }

  void setProfileImage(String url) {
    _profileImage = url;
    notifyListeners();
  }

  /// Fetches current user's name, email, and photo from Firestore
  Future<void> fetchUserName() async {
    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user != null) {
        debugPrint("Fetching data for UID: ${user.uid}");
        final snapshot = await FirebaseFirestore.instance
            .collection('users')
            .doc(user.uid)
            .get();

        if (snapshot.exists) {
          final data = snapshot.data();
          _userName = data?['name'] ?? 'User';
          _userEmail = data?['email'] ?? '';
          _profileImage = data?['photoUrl'] ?? user.photoURL ?? '';
          debugPrint("Fetched name: $_userName, email: $_userEmail, image: $_profileImage");
          notifyListeners();
        } else {
          debugPrint("User document not found in Firestore.");
        }
      } else {
        debugPrint("User is not logged in.");
      }
    } catch (e) {
      debugPrint("Error in fetchUserName: $e");
    }
  }

  /// Starts/stops voice recognition and navigates if matched service is found
  Future<void> listen(Function(String matchedService) onServiceMatched) async {
    if (!_isListening) {
      bool available = await _speech.initialize();
      if (available) {
        _isListening = true;
        notifyListeners();

        _speech.listen(
          onResult: (result) {
            final spokenText = result.recognizedWords.toLowerCase();
            searchController.text = spokenText;

            final List<String> knownServices = [
              "cleaning",
              "electrician",
              "plumber",
              "repair",
              "beauty",
              "more"
            ];

            for (String service in knownServices) {
              if (spokenText.contains(service)) {
                onServiceMatched(service);
                break;
              }
            }
          },
        );
      }
    } else {
      _speech.stop();
      _isListening = false;
      notifyListeners();
    }
  }
}
