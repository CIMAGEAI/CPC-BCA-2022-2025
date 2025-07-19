import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';
import 'package:quickfix/view/screens/home_screen.dart';
import 'package:quickfix/view/screens/onboarding/onboarding_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _navigateToNext();
  }

  Future<void> _navigateToNext() async {
    await Future.delayed(const Duration(seconds: 3));
    final user = FirebaseAuth.instance.currentUser;

    if (user != null) {
      // User is logged in
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const HomeScreen()),
      );
    } else {
      // User not logged in
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const OnboardingPage()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final height = MediaQuery.of(context).size.height;
    final width = MediaQuery.of(context).size.width;

    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Lottie.asset(
              'assets/lottie/service3.json',
              height: height * 0.4,
              width: width * 0.6,
              fit: BoxFit.contain,
            ),
            SizedBox(height: height * 0.03),
            Text(
              "QuickFix",
              style: TextStyle(
                fontSize: width * 0.05,
                fontWeight: FontWeight.w600,
                color: Colors.teal.shade700,
              ),
              textAlign: TextAlign.center,
            ),
            Text(
              "Home services at your fingertips",
              style: TextStyle(
                fontSize: width * 0.035,
                color: Colors.grey,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
