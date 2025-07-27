import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:quickfix/view/screens/vendor_profile_screen.dart';

class VendorHomeScreen extends StatefulWidget {
  const VendorHomeScreen({super.key});

  @override
  State<VendorHomeScreen> createState() => _VendorHomeScreenState();
}

class _VendorHomeScreenState extends State<VendorHomeScreen> {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  String? selectedServiceType;
  bool serviceSelected = false;

  final List<String> serviceTypes = [
    'AC Repair', 'Beauty', 'Salon', 'Car Service',
    'Painting', 'Plumbing', 'Electrician', 'Home Cleaning',
  ];

  final Map<String, TextEditingController> _otpControllers = {};

  String get uid => _auth.currentUser?.uid ?? '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.black,
        elevation: 2,
        title: const Text('Vendor Dashboard', style: TextStyle(color: Colors.white)),
        actions: [
          IconButton(
            icon: const Icon(Icons.person, color: Colors.white),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const VendorProfileScreen()),
              );
            },
          )
        ],
      ),
      body: serviceSelected ? _buildOrderRequests() : _buildServiceSelection(),
    );
  }

  Widget _buildServiceSelection() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Select Your Service Type:',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            DropdownButtonFormField<String>(
              value: selectedServiceType,
              hint: const Text("Choose Service Type"),
              items: serviceTypes
                  .map((type) => DropdownMenuItem(
                value: type,
                child: Text(type),
              ))
                  .toList(),
              onChanged: (val) {
                setState(() {
                  selectedServiceType = val;
                });
              },
              decoration: InputDecoration(
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                if (selectedServiceType != null) {
                  setState(() => serviceSelected = true);
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.black,
                foregroundColor: Colors.white,
              ),
              child: const Text('Proceed'),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildOrderRequests() {
    return StreamBuilder<QuerySnapshot>(
      stream: _firestore
          .collection('orders')
          .where('serviceType', isEqualTo: selectedServiceType)
          .where('status', whereIn: ['pending', 'booked'])
          .snapshots(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
          return const Center(child: Text('No orders found.'));
        }

        final orders = snapshot.data!.docs;

        return ListView.builder(
          itemCount: orders.length,
          itemBuilder: (context, index) {
            final doc = orders[index];
            final order = doc.data() as Map<String, dynamic>;
            final docId = doc.id;

            final bool isBookedByMe =
                order['status'] == 'booked' && order['providerId'] == uid;

            _otpControllers.putIfAbsent(docId, () => TextEditingController());

            return Card(
              margin: const EdgeInsets.all(10),
              elevation: 3,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(12.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("🛠️ Service: ${order['serviceName']}", style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    Text("👤 User: ${order['userName'] ?? 'N/A'}"),
                    Text("💰 Price: ₹${order['price'] ?? 0}"),
                    const SizedBox(height: 10),

                    if (order['status'] == 'pending') ...[
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          ElevatedButton(
                            onPressed: () async {
                              final otp = _generateOTP();
                              await _firestore.collection('orders').doc(docId).update({
                                'status': 'booked',
                                'providerId': uid,
                                'providerName': _auth.currentUser?.displayName ?? 'Vendor',
                                'otp': otp,
                              });
                              ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Order accepted. OTP: $otp')));
                            },
                            style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                            child: const Text('Accept'),
                          ),
                          ElevatedButton(
                            onPressed: () async {
                              await _firestore.collection('orders').doc(docId).update({
                                'status': 'rejected',
                              });
                            },
                            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                            child: const Text('Reject'),
                          ),
                        ],
                      )
                    ],

                    if (isBookedByMe) ...[
                      const SizedBox(height: 12),
                      Text("🔑 Enter OTP to start service:"),
                      const SizedBox(height: 6),
                      TextField(
                        controller: _otpControllers[docId],
                        decoration: const InputDecoration(
                          border: OutlineInputBorder(),
                          hintText: 'Enter OTP',
                        ),
                        keyboardType: TextInputType.number,
                      ),
                      const SizedBox(height: 10),
                      ElevatedButton(
                        onPressed: () async {
                          String enteredOtp = _otpControllers[docId]?.text.trim() ?? '';
                          String correctOtp = order['otp'] ?? '';

                          if (enteredOtp == correctOtp) {
                            await _firestore.collection('orders').doc(docId).update({
                              'status': 'in_process',
                              'startTime': DateTime.now().toIso8601String(),
                            });
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('✅ Service started.')),
                            );
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('❌ Incorrect OTP.')),
                            );
                          }
                        },
                        style: ElevatedButton.styleFrom(backgroundColor: Colors.blueAccent),
                        child: const Text('Start Service'),
                      ),
                    ],
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  String _generateOTP() {
    final otp = (1000 + (DateTime.now().millisecondsSinceEpoch % 9000)).toInt();
    return otp.toString();
  }
}
