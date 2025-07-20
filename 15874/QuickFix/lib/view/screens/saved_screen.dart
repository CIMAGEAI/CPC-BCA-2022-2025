import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../view_model/saved_view_model.dart';
import '../../data/models/service_item.dart';

class SavedScreen extends StatelessWidget {
  const SavedScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final savedItems = context.watch<SavedViewModel>().savedItems;
    final width = MediaQuery.of(context).size.width;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Saved Services'),
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
      ),
      body: savedItems.isEmpty
          ? const Center(child: Text("No favorites added yet."))
          : ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: savedItems.length,
        itemBuilder: (context, index) {
          final item = savedItems[index];
          return Card(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            margin: const EdgeInsets.only(bottom: 16),
            elevation: 3,
            child: ListTile(
              contentPadding: const EdgeInsets.all(16),
              title: Text(
                item.name,
                style: TextStyle(fontSize: width * 0.045, fontWeight: FontWeight.bold),
              ),
              subtitle: Text(
                item.description,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(fontSize: width * 0.035, color: Colors.grey[600]),
              ),
              trailing: IconButton(
                icon: const Icon(Icons.favorite, color: Colors.red),
                onPressed: () => context.read<SavedViewModel>().removeItem(item),
              ),
            ),
          );
        },
      ),
    );
  }
}
