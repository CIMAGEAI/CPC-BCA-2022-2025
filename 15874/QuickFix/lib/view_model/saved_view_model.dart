import 'package:flutter/material.dart';
import 'package:quickfix/data/models/service_item.dart';

class SavedViewModel extends ChangeNotifier {
  final List<ServiceItem> _savedItems = [];

  List<ServiceItem> get savedItems => List.unmodifiable(_savedItems);

  void toggleFavorite(ServiceItem item) {
    item.isFavorite = !item.isFavorite;
    if (item.isFavorite) {
      if (!_savedItems.any((e) => e.name == item.name)) {
        _savedItems.add(item);
      }
    } else {
      _savedItems.removeWhere((e) => e.name == item.name);
    }
    notifyListeners();
  }

  void removeItem(ServiceItem item) {
    item.isFavorite = false;
    _savedItems.removeWhere((e) => e.name == item.name);
    notifyListeners();
  }

  void clearAll() {
    for (var item in _savedItems) {
      item.isFavorite = false;
    }
    _savedItems.clear();
    notifyListeners();
  }
}
