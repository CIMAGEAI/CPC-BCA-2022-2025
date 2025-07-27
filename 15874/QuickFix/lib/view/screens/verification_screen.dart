import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:quickfix/view/screens/auth/register_screen.dart';
import 'package:quickfix/view/screens/home_screen.dart';
import 'package:quickfix/view/screens/provider_home_screen.dart';

class VerificationScreen extends StatefulWidget {
  final String userID;
  final int userType;

  const VerificationScreen({
    super.key,
    required this.userID,
    required this.userType,
  });

  @override
  State<VerificationScreen> createState() => _VerificationScreenState();
}

class _VerificationScreenState extends State<VerificationScreen> {
  bool _isVerified = false;
  bool _checking = false;

  @override
  void initState() {
    super.initState();
    print("🔍 initState: userID = ${widget.userID}, userType = ${widget.userType}");
    _checkVerification();
  }

  Future<void> _checkVerification() async {
    setState(() => _checking = true);

    try {
      await FirebaseAuth.instance.currentUser?.reload();
      final currentUser = FirebaseAuth.instance.currentUser;

      _isVerified = currentUser?.emailVerified ?? false;
      print("✅ Email verified: $_isVerified");

      if (_isVerified) {
        print("📥 Fetching document for user: ${widget.userID}");
        final doc = await FirebaseFirestore.instance
            .collection('users')
            .doc(widget.userID)
            .get();

        int finalUserType = widget.userType;

        if (doc.exists) {
          final data = doc.data();
          print("📄 Firestore data: $data");

          if (data != null && data.containsKey('userType')) {
            finalUserType = data['userType'];
            print("👤 UserType from Firestore: $finalUserType");
          }
        } else {
          print("⚠️ No user document found. Using widget.userType = ${widget.userType}");
        }

        // Navigate based on user type
        if (finalUserType == 1) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (_) => const VendorHomeScreen()),
          );
        } else if (finalUserType == 0) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (_) => const HomeScreen()),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Invalid user type.')),
          );
        }
      } else {
        print("📧 Email is not verified yet.");
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Email not verified yet.')),
        );
      }
    } catch (e) {
      print("❌ Error verifying user: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error verifying user: $e')),
      );
    }

    setState(() => _checking = false);
  }

  Future<void> _resendVerificationEmail() async {
    try {
      final user = FirebaseAuth.instance.currentUser;
      await user?.sendEmailVerification();
      print("📤 Verification email resent to: ${user?.email}");
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Verification email sent.")),
      );
    } catch (e) {
      print("❌ Failed to resend verification email: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to send email: $e")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (_) => const RegisterScreen()),
            );
          },
        ),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: Padding(
        padding: EdgeInsets.symmetric(horizontal: width * 0.08),
        child: Center(
          child: _checking
              ? const CircularProgressIndicator()
              : Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                "Verify Your Email",
                style: TextStyle(
                  fontSize: width * 0.06,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                "We've sent a verification link to your email.\nClick the link and then tap the button below.",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: width * 0.035),
              ),
              const SizedBox(height: 30),
              ElevatedButton(
                onPressed: _checkVerification,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.black,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text("I Verified My Email"),
              ),
              const SizedBox(height: 20),
              TextButton(
                onPressed: _resendVerificationEmail,
                child: const Text("Resend Verification Email"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
