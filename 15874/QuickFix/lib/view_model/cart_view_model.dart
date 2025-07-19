import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:quickfix/data/models/service_item.dart';

class CartViewModel extends ChangeNotifier {
  final List<ServiceItem> _cartItems = [];
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  List<ServiceItem> get cartItems => List.unmodifiable(_cartItems);

  double get total => _cartItems.fold(0, (sum, item) => sum + item.price);
  double get gst => total * 0.18;
  double get totalWithGst => total + gst;

  String get uid => _auth.currentUser?.uid ?? '';

  bool _isFetching = false;
  bool get isFetching => _isFetching;

  /// Fetch cart items (use in initState of CartScreen)
  Future<void> fetchCartItems() async {
    if (uid.isEmpty) return;

    _isFetching = true;
    notifyListeners();

    try {
      final snapshot = await _firestore
          .collection('users')
          .doc(uid)
          .collection('cart')
          .get();

      _cartItems.clear();
      for (var doc in snapshot.docs) {
        final item = ServiceItem.fromMap(doc.data());
        _cartItems.add(item);
      }
    } catch (e) {
      debugPrint("Error fetching cart items: $e");
    }

    _isFetching = false;
    notifyListeners();
  }

  /// Add item to cart, prevent duplicates
  Future<void> addToCart(ServiceItem item, BuildContext context) async {
    if (uid.isEmpty) return;

    final alreadyInCart = _cartItems.any((i) => i.id == item.id);
    if (alreadyInCart) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Item already in cart.")),
      );
      return;
    }

    // Set default status
    final itemWithStatus = item.copyWith(status: 'pending');

    _cartItems.add(itemWithStatus);
    notifyListeners();

    try {
      await _firestore
          .collection('users')
          .doc(uid)
          .collection('cart')
          .doc(item.id)
          .set(itemWithStatus.toMap());

      if (context.mounted) {
        Navigator.pushNamed(context, '/cart');
      }
    } catch (e) {
      debugPrint("Error adding to cart: $e");
    }
  }

  /// Remove item from cart
  Future<void> removeFromCart(ServiceItem item) async {
    if (uid.isEmpty) return;

    _cartItems.removeWhere((i) => i.id == item.id);
    notifyListeners();

    try {
      await _firestore
          .collection('users')
          .doc(uid)
          .collection('cart')
          .doc(item.id)
          .delete();
    } catch (e) {
      debugPrint("Error removing from cart: $e");
    }
  }

  /// Clear all cart items
  Future<void> clearCart() async {
    if (uid.isEmpty) return;

    try {
      for (var item in _cartItems) {
        await _firestore
            .collection('users')
            .doc(uid)
            .collection('cart')
            .doc(item.id)
            .delete();
      }

      _cartItems.clear();
      notifyListeners();
    } catch (e) {
      debugPrint("Error clearing cart: $e");
    }
  }

  /// Update status of a cart item
  Future<void> updateStatus(String itemId, String newStatus) async {
    final index = _cartItems.indexWhere((item) => item.id == itemId);
    if (index == -1) return;

    _cartItems[index] = _cartItems[index].copyWith(status: newStatus);
    notifyListeners();

    try {
      await _firestore
          .collection('users')
          .doc(uid)
          .collection('cart')
          .doc(itemId)
          .update({'status': newStatus});
    } catch (e) {
      debugPrint("Error updating status: $e");
    }
  }
}
