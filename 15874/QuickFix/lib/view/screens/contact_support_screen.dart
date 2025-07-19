// lib/view/screens/misc/contact_support_screen.dart

import 'package:flutter/material.dart';

class ContactSupportScreen extends StatefulWidget {
  const ContactSupportScreen({super.key});

  @override
  State<ContactSupportScreen> createState() => _ContactSupportScreenState();
}

class _ContactSupportScreenState extends State<ContactSupportScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _messageController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Contact Support"),
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(labelText: "Name"),
            ),
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(labelText: "Email"),
              keyboardType: TextInputType.emailAddress,
            ),
            TextField(
              controller: _messageController,
              decoration: const InputDecoration(labelText: "Your Message"),
              maxLines: 4,
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: () {
                // TODO: Add support message send logic (Firestore/Email)
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Message sent to support!")),
                );
              },
              icon: const Icon(Icons.send),
              label: const Text("Send"),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.black,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                textStyle: const TextStyle(fontSize: 16),
              ),
            ),

          ],
        ),
      ),
    );
  }
}
