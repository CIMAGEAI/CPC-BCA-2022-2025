import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:quickfix/view/screens/auth/login_screen.dart';
import 'package:quickfix/view/screens/verification_screen.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmController = TextEditingController();

  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  bool _isLoading = false;

  final List<String> _roles = ['Customer', 'Service Provider'];
  String _selectedRole = 'Customer';

  int get userType {
    final type = _selectedRole == 'Service Provider' ? 1 : 0;
    print('🔍 Selected role: $_selectedRole ➝ userType: $type');
    return type;
  }

  Future<void> _handleRegister() async {
    setState(() => _isLoading = true);

    final name = _nameController.text.trim();
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();
    final confirmPassword = _confirmController.text.trim();

    if (password != confirmPassword) {
      _showMsg("Passwords do not match");
      setState(() => _isLoading = false);
      return;
    }

    try {
      final UserCredential userCredential =
      await FirebaseAuth.instance.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      final User? user = userCredential.user;
      if (user != null) {
        await user.sendEmailVerification();

        print("✅ Firebase Auth User created: UID = ${user.uid}");
        print("📤 Writing to Firestore...");

        await FirebaseFirestore.instance.collection('users').doc(user.uid).set({
          'name': name,
          'email': email,
          'userType': userType,
          'profileImage': '',
          'createdAt': FieldValue.serverTimestamp(),
        });

        print("✅ Firestore data saved successfully!");

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => VerificationScreen(
              userID: user.uid,
              userType: userType,
            ),
          ),
        );
      }
    } catch (e) {
      print("❌ Registration error: $e");
      _showMsg("Registration failed: ${e.toString()}");
    }

    setState(() => _isLoading = false);
  }

  Future<void> _handleGoogleSignIn() async {
    try {
      await GoogleSignIn().signOut();
      final googleUser = await GoogleSignIn().signIn();
      if (googleUser == null) return;

      final googleAuth = await googleUser.authentication;
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final userCred = await FirebaseAuth.instance.signInWithCredential(credential);
      final user = userCred.user;

      if (user != null) {
        final userDoc =
        await FirebaseFirestore.instance.collection('users').doc(user.uid).get();

        if (!userDoc.exists) {
          await FirebaseFirestore.instance.collection('users').doc(user.uid).set({
            'name': user.displayName ?? '',
            'email': user.email ?? '',
            'profileImage': user.photoURL ?? '',
            'userType': userType,
            'createdAt': FieldValue.serverTimestamp(),
          });
          print("🆕 Google user added to Firestore.");
        }

        if (!user.emailVerified) await user.sendEmailVerification();

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => VerificationScreen(userID: user.uid, userType: userType),
          ),
        );
      }
    } catch (e) {
      print("❌ Google Sign-In Error: $e");
      _showMsg("Google sign-in failed: $e");
    }
  }

  void _showMsg(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    bool obscure = false,
    VoidCallback? toggleObscure,
  }) {
    return TextField(
      controller: controller,
      obscureText: obscure,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        suffixIcon: toggleObscure != null
            ? IconButton(
          icon: Icon(obscure ? Icons.visibility : Icons.visibility_off),
          onPressed: toggleObscure,
        )
            : null,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final height = MediaQuery.of(context).size.height;
    final width = MediaQuery.of(context).size.width;

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: width * 0.08),
          child: SingleChildScrollView(
            child: Column(
              children: [
                SizedBox(height: height * 0.05),
                Image.asset('assets/images/logo2.png', width: width * 0.4),
                SizedBox(height: height * 0.02),
                Text("Create Account",
                    style: TextStyle(fontSize: width * 0.07, fontWeight: FontWeight.bold)),
                SizedBox(height: height * 0.04),
                _buildTextField(controller: _nameController, label: "Full Name", icon: Icons.person),
                SizedBox(height: height * 0.02),
                _buildTextField(controller: _emailController, label: "Email", icon: Icons.email),
                SizedBox(height: height * 0.02),
                _buildTextField(
                  controller: _passwordController,
                  label: "Password",
                  icon: Icons.lock,
                  obscure: _obscurePassword,
                  toggleObscure: () => setState(() => _obscurePassword = !_obscurePassword),
                ),
                SizedBox(height: height * 0.02),
                _buildTextField(
                  controller: _confirmController,
                  label: "Confirm Password",
                  icon: Icons.lock,
                  obscure: _obscureConfirmPassword,
                  toggleObscure: () => setState(() => _obscureConfirmPassword = !_obscureConfirmPassword),
                ),
                SizedBox(height: height * 0.02),
                DropdownButtonFormField<String>(
                  value: _selectedRole,
                  items: _roles
                      .map((role) => DropdownMenuItem(value: role, child: Text(role)))
                      .toList(),
                  onChanged: (val) => setState(() => _selectedRole = val ?? 'Customer'),
                  decoration: InputDecoration(
                    labelText: "Select Role",
                    prefixIcon: const Icon(Icons.group),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
                SizedBox(height: height * 0.03),
                SizedBox(
                  width: double.infinity,
                  height: height * 0.06,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _handleRegister,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.black,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: _isLoading
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text("Register", style: TextStyle(fontSize: 16)),
                  ),
                ),
                SizedBox(height: height * 0.03),
                const DividerWithText(),
                SizedBox(height: height * 0.03),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    _socialButton(
                      icon: FontAwesomeIcons.google,
                      label: "Google",
                      onPressed: _handleGoogleSignIn,
                    ),
                    SizedBox(width: width * 0.05),
                    _socialButton(
                      icon: FontAwesomeIcons.apple,
                      label: "Apple",
                      onPressed: () {}, // implement if needed
                    ),
                  ],
                ),
                SizedBox(height: height * 0.03),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text("Already have an account?"),
                    TextButton(
                      onPressed: () => Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(builder: (_) => const LoginScreen()),
                      ),
                      child: const Text("Login"),
                    ),
                  ],
                ),
                SizedBox(height: height * 0.02),
                const TermsText(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _socialButton({
    required IconData icon,
    required String label,
    required VoidCallback onPressed,
  }) {
    return ElevatedButton.icon(
      onPressed: onPressed,
      icon: FaIcon(icon, color: Colors.black),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        side: const BorderSide(color: Colors.grey),
      ),
    );
  }
}

class DividerWithText extends StatelessWidget {
  const DividerWithText({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: const [
        Expanded(child: Divider()),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 8.0),
          child: Text("OR"),
        ),
        Expanded(child: Divider()),
      ],
    );
  }
}

class TermsText extends StatelessWidget {
  const TermsText({super.key});

  @override
  Widget build(BuildContext context) {
    return const Text.rich(
      TextSpan(
        text: 'By registering, you agree to our ',
        style: TextStyle(fontSize: 12),
        children: [
          TextSpan(text: 'Terms of Service', style: TextStyle(color: Colors.blue)),
          TextSpan(text: ' and '),
          TextSpan(text: 'Privacy Policy', style: TextStyle(color: Colors.blue)),
          TextSpan(text: '.'),
        ],
      ),
      textAlign: TextAlign.center,
    );
  }
}
