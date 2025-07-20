import 'package:flutter/material.dart';

class NotificationScreen extends StatelessWidget {
  const NotificationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, String>> fakeNotifications = [
      {
        'title': 'Booking Confirmed!',
        'subtitle': 'Your plumbing service is confirmed for tomorrow at 10 AM.',
        'time': '2 hrs ago'
      },
      {
        'title': 'Offer Unlocked',
        'subtitle': 'Get 20% off on all cleaning services this weekend!',
        'time': '5 hrs ago'
      },
      {
        'title': 'New Message',
        'subtitle': 'Your assigned electrician has sent a message.',
        'time': 'Yesterday'
      },
      {
        'title': 'Service Completed',
        'subtitle': 'Your beauty service is marked as complete. Rate your experience.',
        'time': '2 days ago'
      },
      {
        'title': 'Reminder',
        'subtitle': 'Your AC repair is scheduled for today at 4 PM.',
        'time': '3 days ago'
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications', style: TextStyle(color: Colors.black)),
        backgroundColor: Colors.white,
        elevation: 1,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        itemCount: fakeNotifications.length,
        separatorBuilder: (context, index) => const Divider(),
        itemBuilder: (context, index) {
          final item = fakeNotifications[index];
          return ListTile(
            leading: const Icon(Icons.notifications, color: Colors.teal),
            title: Text(item['title']!, style: const TextStyle(fontWeight: FontWeight.w600)),
            subtitle: Text(item['subtitle']!),
            trailing: Text(
              item['time']!,
              style: const TextStyle(fontSize: 12, color: Colors.grey),
            ),
          );
        },
      ),
    );
  }
}
