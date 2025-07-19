class ServiceItem {
  final String id;
  final String name;
  final String description;
  final double price;
  final double rating;
  final String status;
  bool isFavorite;

  ServiceItem({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.rating,
    this.status = 'pending', // default value
    this.isFavorite = false,
  });

  void toggleFavorite() {
    isFavorite = !isFavorite;
  }

  ServiceItem copyWith({
    String? id,
    String? name,
    String? description,
    double? price,
    double? rating,
    String? status,
    bool? isFavorite,
  }) {
    return ServiceItem(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      price: price ?? this.price,
      rating: rating ?? this.rating,
      status: status ?? this.status,
      isFavorite: isFavorite ?? this.isFavorite,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'price': price,
      'rating': rating,
      'status': status,
      'isFavorite': isFavorite,
    };
  }

  factory ServiceItem.fromMap(Map<String, dynamic> map) {
    return ServiceItem(
      id: map['id']?.toString() ?? '',
      name: map['name']?.toString() ?? 'Unknown',
      description: map['description']?.toString() ?? '',
      price: (map['price'] is int)
          ? (map['price'] as int).toDouble()
          : (map['price'] ?? 0.0).toDouble(),
      rating: (map['rating'] is int)
          ? (map['rating'] as int).toDouble()
          : (map['rating'] ?? 0.0).toDouble(),
      status: map['status']?.toString() ?? 'pending',
      isFavorite: map['isFavorite'] ?? false,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
          other is ServiceItem && runtimeType == other.runtimeType && id == other.id;

  @override
  int get hashCode => id.hashCode;
}
