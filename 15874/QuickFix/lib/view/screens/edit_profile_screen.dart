import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({Key? key}) : super(key: key);

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  late User _user;

  @override
  void initState() {
    super.initState();
    _user = _auth.currentUser!;
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final userData =
    await _firestore.collection('users').doc(_user.uid).get();
    _nameController.text = userData['name'] ?? '';
    _emailController.text = _user.email ?? '';
  }

  Future<void> _updateProfile() async {
    if (!_formKey.currentState!.validate()) return;

    try {
      final newName = _nameController.text.trim();
      final newEmail = _emailController.text.trim();
      final newPassword = _passwordController.text.trim();

      if (newEmail != _user.email) {
        await _user.updateEmail(newEmail);
        await _user.sendEmailVerification();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Verification link sent to new email.")),
        );
      }

      if (newPassword.isNotEmpty) {
        await _user.updatePassword(newPassword);
      }

      await _firestore.collection('users').doc(_user.uid).update({
        'name': newName,
        'email': newEmail,
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Profile updated successfully.")),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error: ${e.toString()}")),
      );
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Edit Profile"),
      backgroundColor: Colors.black,
      foregroundColor: Colors.white,),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              const SizedBox(height: 16),
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'Full Name'),
                validator: (value) =>
                value!.isEmpty ? "Name cannot be empty" : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(labelText: 'Email'),
                validator: (value) =>
                value!.contains('@') ? null : "Enter a valid email",
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _passwordController,
                decoration: const InputDecoration(labelText: 'New Password (optional)'),
                obscureText: true,
              ),
              const SizedBox(height: 30),
              ElevatedButton(
                onPressed: _updateProfile,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.black,
                  foregroundColor: Colors.white,        
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  textStyle: const TextStyle(fontSize: 16),
                ),
                child: const Text("Update Profile"),
              ),

            ],
          ),
        ),
      ),
    );
  }
}
