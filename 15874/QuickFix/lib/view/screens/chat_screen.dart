import 'package:flutter/material.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final List<Map<String, String>> _messages = [];

  final Map<String, String> faqAnswers = {
    "What services do you offer?":
    "We offer AC repair, salon at home, cleaning, plumbing, electrician, painting, and more.",
    "How can I book a service?":
    "Go to the Home or Explore tab, choose a service, and tap 'Book Now'.",
    "What is your cancellation policy?":
    "You can cancel up to 2 hours before the scheduled time for a full refund.",
    "How do I get a refund?":
    "Refunds are processed automatically within 5–7 working days to your original payment method.",
    "Can I reschedule my service?":
    "Yes! Visit 'My Orders' in your profile and tap on the reschedule option.",
    "How can I contact customer support?":
    "You can email us at support@quickfix.com or call our helpline from 9am–7pm.",
  };

  void handleUserInput(String question) {
    setState(() {
      _messages.add({"user": question});
      _messages.add({
        "bot": faqAnswers[question] ??
            "Sorry, I don't have an answer for that yet."
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        title: const Text("FAQs & Support"),
      ),
      backgroundColor: Colors.white,
      body: Column(
        children: [
          /// Chat Messages
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final entry = _messages[index];
                final isUser = entry.containsKey("user");
                final text = isUser ? entry["user"]! : entry["bot"]!;
                return Align(
                  alignment:
                  isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 6),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 10),
                    constraints: BoxConstraints(maxWidth: width * 0.8),
                    decoration: BoxDecoration(
                      color:
                      isUser ? Colors.black : Colors.grey.shade200,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      text,
                      style: TextStyle(
                        color: isUser ? Colors.white : Colors.black,
                        fontSize: width * 0.038,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          const Divider(thickness: 0.5),

          /// FAQ Options like user messages (small right bubbles, 2 per row)
          Padding(
            padding:
            const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Align(
              alignment: Alignment.centerRight,
              child: Wrap(
                spacing: 8,
                runSpacing: 8,
                children: faqAnswers.keys.map((question) {
                  return GestureDetector(
                    onTap: () => handleUserInput(question),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 8),
                      constraints:
                      BoxConstraints(maxWidth: width * 0.4),
                      decoration: BoxDecoration(
                        color: Colors.black,
                        borderRadius: BorderRadius.circular(18),
                      ),
                      child: Text(
                        question,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: width * 0.03,
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
          const SizedBox(height: 12),
        ],
      ),
    );
  }
}
