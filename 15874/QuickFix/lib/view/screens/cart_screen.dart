import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../view_model/cart_view_model.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchCartData();
  }

  Future<void> _fetchCartData() async {
    final cartViewModel = Provider.of<CartViewModel>(context, listen: false);
    await cartViewModel.fetchCartItems();
    if (mounted) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final cartViewModel = Provider.of<CartViewModel>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text("Your Cart"),
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Expanded(
              child: cartViewModel.cartItems.isEmpty
                  ? const Center(child: Text("Cart is empty"))
                  : ListView.builder(
                itemCount: cartViewModel.cartItems.length,
                itemBuilder: (context, index) {
                  final item = cartViewModel.cartItems[index];
                  return ListTile(
                    title: Text(item.name),
                    subtitle: Text("₹${item.price.toStringAsFixed(2)}"),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete),
                      onPressed: () {
                        cartViewModel.removeFromCart(item);
                      },
                    ),
                  );
                },
              ),
            ),
            const Divider(thickness: 1),
            ListTile(
              title: const Text("Subtotal"),
              trailing: Text("₹${cartViewModel.total.toStringAsFixed(2)}"),
            ),
            ListTile(
              title: const Text("GST (18%)"),
              trailing: Text("₹${cartViewModel.gst.toStringAsFixed(2)}"),
            ),
            ListTile(
              title: const Text("Total"),
              trailing: Text(
                "₹${cartViewModel.totalWithGst.toStringAsFixed(2)}",
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 10),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () async {
                  final cartItems = cartViewModel.cartItems;
                  if (cartItems.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("Cart is empty")),
                    );
                    return;
                  }

                  try {
                    final firestore = FirebaseFirestore.instance;
                    final user = FirebaseAuth.instance.currentUser!;
                    final userId = user.uid;

                    final orderData = {
                      'userId': userId,
                      'items': cartItems.map((item) => item.toMap()).toList(),
                      'subtotal': cartViewModel.total,
                      'gst': cartViewModel.gst,
                      'total': cartViewModel.totalWithGst,
                      'providerId': null, // will be updated later
                      'status': 'Pending',
                      'timestamp': FieldValue.serverTimestamp(),
                    };

                    print("📝 Prepared order data: $orderData");

                    // Save to user_orders
                    final userOrderRef = await firestore
                        .collection('orders')
                        .doc(userId)
                        .collection('user_orders')
                        .add(orderData);

                    print("✅ Order saved to user_orders with ID: ${userOrderRef.id}");

                    // Search and notify provider
                    for (final item in cartItems) {
                      final providerQuery = await firestore
                          .collection('providers')
                          .where('services', arrayContains: item.name)
                          .limit(1)
                          .get();

                      if (providerQuery.docs.isNotEmpty) {
                        final providerId = providerQuery.docs.first.id;

                        await firestore.collection('notifications').add({
                          'to': providerId,
                          'from': userId,
                          'type': 'order',
                          'message': 'New service request for ${item.name}',
                          'timestamp': FieldValue.serverTimestamp(),
                        });

                        print("📩 Notification sent to provider: $providerId");

                        await firestore
                            .collection('orders')
                            .doc(providerId)
                            .collection('provider_orders')
                            .add({
                          ...orderData,
                          'fromUser': userId,
                          'serviceRequested': item.name,
                          'providerId': providerId,
                        });

                        print("📦 Order added to provider_orders for $providerId");
                      } else {
                        print("⚠️ No provider found for service: ${item.name}");
                      }
                    }

                    await cartViewModel.clearCart();
                    print("🧹 Cart cleared after placing order.");

                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("Order placed successfully!")),
                      );
                      Navigator.pop(context);
                    }
                  } catch (e, stack) {
                    print("❌ Error during checkout: $e");
                    print(stack);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text("Error: ${e.toString()}")),
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.black,
                  foregroundColor: Colors.white,
                ),
                child: const Text("Proceed to Checkout"),
              ),
            )
          ],
        ),
      ),
    );
  }
}
