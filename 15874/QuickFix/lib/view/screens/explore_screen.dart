import 'package:flutter/material.dart';
import 'package:quickfix/data/models/service_item.dart';


import 'service_screen.dart';

class ExploreScreen extends StatelessWidget {
  const ExploreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final height = MediaQuery.of(context).size.height;

    final services = [
      {'title': 'AC Repair', 'icon': Icons.ac_unit},
      {'title': 'Salon at Home', 'icon': Icons.content_cut},
      {'title': 'Home Cleaning', 'icon': Icons.cleaning_services},
      {'title': 'Electrician', 'icon': Icons.electrical_services},
      {'title': 'Plumber', 'icon': Icons.plumbing},
      {'title': 'Painting', 'icon': Icons.format_paint},
    ];

    final Map<String, List<ServiceItem>> serviceDetails = {
      'AC Repair': [
        ServiceItem(id: 'ac1', name: "Split AC Foam Cleaning", description: "Deep foam clean for split AC units.", price: 499, rating: 4.5),
        ServiceItem(id: 'ac2', name: "Split AC Water Cleaning", description: "Water-based clean for split ACs.", price: 399, rating: 4.3),
        ServiceItem(id: 'ac3', name: "Window AC Foam Cleaning", description: "Foam cleaning for window ACs.", price: 449, rating: 4.4),
        ServiceItem(id: 'ac4', name: "Window AC Water Cleaning", description: "Water cleaning for window ACs.", price: 349, rating: 4.2),
      ],
      'Salon at Home': [
        ServiceItem(id: 'salon1', name: "Haircut & Styling", description: "Professional salon experience at home.", price: 299, rating: 4.6),
        ServiceItem(id: 'salon2', name: "Facial & Cleanup", description: "Glow-enhancing facial and cleanup.", price: 499, rating: 4.7),
        ServiceItem(id: 'salon3', name: "Manicure & Pedicure", description: "Complete hand and foot care service.", price: 599, rating: 4.8),
      ],
      'Home Cleaning': [
        ServiceItem(id: 'clean1', name: "Kitchen Deep Cleaning", description: "Complete kitchen sanitization.", price: 799, rating: 4.5),
        ServiceItem(id: 'clean2', name: "Bathroom Deep Cleaning", description: "Sparkling clean bathroom service.", price: 699, rating: 4.4),
        ServiceItem(id: 'clean3', name: "Full Home Cleaning", description: "End-to-end home cleaning.", price: 1499, rating: 4.6),
      ],
      'Electrician': [
        ServiceItem(id: 'elec1', name: "Fan Installation", description: "Ceiling/wall fan setup.", price: 199, rating: 4.3),
        ServiceItem(id: 'elec2', name: "Switchboard Repair", description: "Replace/repair electrical switches.", price: 149, rating: 4.2),
      ],
      'Plumber': [
        ServiceItem(id: 'plumb1', name: "Tap Installation", description: "New tap fitting or replacement.", price: 199, rating: 4.4),
        ServiceItem(id: 'plumb2', name: "Leakage Repair", description: "Fix kitchen/bathroom leaks.", price: 249, rating: 4.5),
      ],
      'Painting': [
        ServiceItem(id: 'paint1', name: "1BHK Paint", description: "Complete 1BHK painting.", price: 4999, rating: 4.7),
        ServiceItem(id: 'paint2', name: "Wall Stain Fix", description: "Patch & clean wall stains.", price: 799, rating: 4.2),
      ],
    };

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Explore Services'),
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        elevation: 1,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: Padding(
        padding: EdgeInsets.symmetric(horizontal: width * 0.04, vertical: height * 0.02),
        child: ListView.separated(
          itemCount: services.length,
          separatorBuilder: (_, __) => const Divider(color: Colors.grey, thickness: 0.3),
          itemBuilder: (context, index) {
            final service = services[index];
            final title = service['title'] as String;

            return ListTile(
              contentPadding: EdgeInsets.symmetric(vertical: height * 0.015),
              leading: CircleAvatar(
                radius: width * 0.07,
                backgroundColor: Colors.black,
                child: Icon(service['icon'] as IconData, color: Colors.white, size: width * 0.07),
              ),
              title: Text(
                title,
                style: TextStyle(fontSize: width * 0.045, fontWeight: FontWeight.w500, color: Colors.black),
              ),
              trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
              onTap: () {
                final serviceList = serviceDetails[title] ?? [];
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => ServiceScreen(
                      categoryTitle: title,
                      services: serviceList,
                    ),
                  ),
                );
              },
            );
          },
        ),
      ),
    );
  }
}
