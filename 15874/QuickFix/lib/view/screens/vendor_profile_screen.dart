import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:provider/provider.dart';
import 'package:quickfix/view/screens/auth/login_screen.dart';
import 'package:quickfix/view/screens/contact_support_screen.dart';
import 'package:quickfix/view/screens/edit_profile_screen.dart';
import 'package:quickfix/view/screens/order_history_screen.dart';
import 'package:quickfix/view/screens/privacy_policy_screen.dart';
import 'package:quickfix/view/screens/terms_conditions_screen.dart';
import 'package:quickfix/view_model/home_view_model.dart';

class VendorProfileScreen extends StatefulWidget {
  const VendorProfileScreen({super.key});

  @override
  State<VendorProfileScreen> createState() => _VendorProfileScreenState();
}

class _VendorProfileScreenState extends State<VendorProfileScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(Duration.zero, () {
      Provider.of<HomeViewModel>(context, listen: false).fetchUserName();
    });
  }

  @override
  Widget build(BuildContext context) {
    final viewModel = Provider.of<HomeViewModel>(context);
    final width = MediaQuery.of(context).size.width;
    final height = MediaQuery.of(context).size.height;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text("Vendor Profile"),
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        elevation: 1,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.symmetric(horizontal: width * 0.06, vertical: height * 0.02),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                CircleAvatar(
                  radius: 35,
                  backgroundImage: viewModel.profileImage.isNotEmpty
                      ? NetworkImage(viewModel.profileImage)
                      : const AssetImage("assets/images/user.png") as ImageProvider,
                ),
                SizedBox(width: width * 0.05),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      viewModel.userName,
                      style: TextStyle(
                        fontSize: width * 0.05,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      viewModel.userEmail,
                      style: TextStyle(
                        fontSize: width * 0.035,
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            SizedBox(height: height * 0.03),

            // Stats
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStat("Completed", "42"),
                _buildStat("Rating", "4.9"),
                _buildStat("Services", "8"),
              ],
            ),

            SizedBox(height: height * 0.03),
            const Divider(),

            // Options
            _profileOption(
              icon: Icons.edit,
              label: "Edit Profile",
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const EditProfileScreen()),
                ).then((_) {
                  Provider.of<HomeViewModel>(context, listen: false).fetchUserName();
                });
              },
            ),
            _profileOption(
              icon: Icons.history,
              label: "Order History",
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const OrderHistoryScreen()),
                );
              },
            ),
            _profileOption(
              icon: Icons.description,
              label: "Terms & Conditions",
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const TermsAndConditionsScreen()),
                );
              },
            ),
            _profileOption(
              icon: Icons.support_agent,
              label: "Customer Support",
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const ContactSupportScreen()),
                );
              },
            ),
            _profileOption(
              icon: Icons.privacy_tip_outlined,
              label: "Privacy Policy",
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const PrivacyPolicyScreen()),
                );
              },
            ),
            _profileOption(
              icon: Icons.logout,
              label: "Logout",
              isDestructive: true,
              onTap: () => _showLogoutDialog(context),
            ),

            SizedBox(height: height * 0.03),
            const Divider(),

            // Footer
            Center(
              child: Column(
                children: [
                  Text("App Version 1.0.0", style: TextStyle(color: Colors.grey, fontSize: width * 0.035)),
                  const SizedBox(height: 4),
                  Text("Vendor App by QuickFix", style: TextStyle(color: Colors.grey[600], fontSize: width * 0.03)),
                ],
              ),
            ),
            SizedBox(height: height * 0.04),
          ],
        ),
      ),
    );
  }

  Widget _buildStat(String title, String value) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        Text(title, style: const TextStyle(color: Colors.grey)),
      ],
    );
  }

  Widget _profileOption({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
    bool isDestructive = false,
  }) {
    return ListTile(
      leading: Icon(icon, color: isDestructive ? Colors.red : Colors.black),
      title: Text(
        label,
        style: TextStyle(
          fontSize: 16,
          color: isDestructive ? Colors.red : Colors.black,
        ),
      ),
      trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
      onTap: onTap,
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Logout"),
        content: const Text("Are you sure you want to logout?"),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          TextButton(
            onPressed: () async {
              await FirebaseAuth.instance.signOut();
              if (mounted) {
                Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                      (route) => false,
                );
              }
            },
            child: const Text("Logout", style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }
}
