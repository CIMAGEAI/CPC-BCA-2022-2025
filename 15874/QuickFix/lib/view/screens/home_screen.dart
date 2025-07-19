import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:quickfix/view/screens/notification_screen.dart';
import 'package:quickfix/view/screens/saved_screen.dart';
import 'package:quickfix/view_model/home_view_model.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:lottie/lottie.dart';
import 'cart_screen.dart';
import 'chat_screen.dart';
import 'explore_screen.dart';
import 'profile_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await Provider.of<HomeViewModel>(context, listen: false).fetchUserName();
    });
  }

  @override
  Widget build(BuildContext context) {
    final viewModel = Provider.of<HomeViewModel>(context);
    final height = MediaQuery
        .of(context)
        .size
        .height;
    final width = MediaQuery
        .of(context)
        .size
        .width;

    final List<Widget> screens = [
      _buildHomeContent(context, viewModel, width, height),
      const ExploreScreen(),
      const SavedScreen(),
      const ProfileScreen(),
    ];

    return Scaffold(
      backgroundColor: Colors.white,
      resizeToAvoidBottomInset: true,
      body: IndexedStack(index: viewModel.currentIndex, children: screens),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton: MediaQuery
          .of(context)
          .viewInsets
          .bottom == 0
          ? FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const ChatScreen()),
          );
        },
        backgroundColor: Colors.black,
        child: const Icon(Icons.chat, color: Colors.white),
      )
          : null,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: viewModel.currentIndex,
        onTap: viewModel.updateNavIndex,
        type: BottomNavigationBarType.fixed,
        selectedItemColor: Colors.black,
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.explore), label: 'Explore'),
          BottomNavigationBarItem(
              icon: Icon(Icons.favorite_border), label: 'Saved'),
          BottomNavigationBarItem(
              icon: Icon(Icons.person_outline), label: 'Profile'),
        ],
      ),
    );
  }

  Widget _buildHomeContent(BuildContext context, HomeViewModel viewModel,
      double width, double height) {
    return SafeArea(
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: EdgeInsets.symmetric(
            horizontal: width * 0.04, vertical: height * 0.02),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                CircleAvatar(
                  backgroundImage: viewModel.profileImage.isNotEmpty
                      ? NetworkImage(viewModel.profileImage)
                      : const AssetImage(
                      'assets/images/user.png') as ImageProvider,
                ),
                Column(
                  children: [
                    Text("Hello",
                        style: TextStyle(
                            fontSize: width * 0.045, color: Colors.grey)),
                    Text(viewModel.userName,
                        style: TextStyle(
                            fontSize: width * 0.05,
                            fontWeight: FontWeight.bold)),
                  ],
                ),
                Row(
                  children: [
                    IconButton(
                      icon: const Icon(
                          Icons.notifications_none, color: Colors.black),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (
                              _) => const NotificationScreen()),
                        );
                      },
                    ),
                    IconButton(
                      icon: const Icon(Icons.shopping_cart),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const CartScreen()),
                        );
                      },
                    )
                  ],
                ),
              ],
            ),
            SizedBox(height: height * 0.02),

            // Search bar
            Container(
              padding: EdgeInsets.symmetric(horizontal: width * 0.04),
              decoration: BoxDecoration(
                color: Colors.grey.shade200,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.search, color: Colors.grey),
                  SizedBox(width: width * 0.02),
                  Expanded(
                    child: TextField(
                      controller: viewModel.searchController,
                      decoration: const InputDecoration(
                        hintText: "Search services...",
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: Icon(
                      viewModel.isListening ? Icons.mic : Icons.mic_none,
                      color: Colors.grey,
                    ),
                    onPressed: () {
                      viewModel.listen((matchedService) {
                        viewModel.updateNavIndex(1);
                      });
                    },
                  )
                ],
              ),
            ),
            SizedBox(height: height * 0.02),

            // Carousel with Lottie animations
            CarouselSlider(
              options: CarouselOptions(
                height: height * 0.25,
                autoPlay: true,
                enlargeCenterPage: true,
              ),
              items: viewModel.animationList.map((animPath) {
                return ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Lottie.asset(
                    animPath,
                    fit: BoxFit.cover,
                    width: width,
                  ),
                );
              }).toList(),
            ),
            SizedBox(height: height * 0.02),

            // Hot Services
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text("Services",
                    style: TextStyle(
                        fontSize: width * 0.05,
                        fontWeight: FontWeight.bold,
                        color: Colors.black)),
                TextButton(
                  onPressed: () {
                    viewModel.updateNavIndex(1);
                  },
                  child: const Text(
                      "View All", style: TextStyle(color: Colors.teal)),
                )
              ],
            ),
            SizedBox(height: height * 0.015),

            // Grid Services
            GridView.count(
              crossAxisCount: 3,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: width * 0.03,
              mainAxisSpacing: height * 0.015,
              children: [
                _serviceTile(context, 'Cleaning', 'assets/images/cleaning.jpg', () {
                  Navigator.pushNamed(context, '/cleaning');
                }),
                _serviceTile(context, 'Electrician', 'assets/images/electricity.jpg', () {
                  Navigator.pushNamed(context, '/electrician');
                }),
                _serviceTile(context, 'Plumber', 'assets/images/plumbing.jpg', () {
                  Navigator.pushNamed(context, '/plumber');
                }),
                _serviceTile(context, 'Repair', 'assets/images/repair.jpg', () {
                  Navigator.pushNamed(context, '/repair');
                }),
                _serviceTile(context, 'Beauty', 'assets/images/beauty.jpg', () {
                  Navigator.pushNamed(context, '/beauty');
                }),
                _serviceTile(context, 'More', 'assets/images/more.jpg', () {
                  Navigator.pushNamed(context, '/more');
                }),
              ],
        ),
        ]
      ),
      ),
    );
  }

  Widget _serviceTile(
      BuildContext context,
      String label,
      String imagePath,
      VoidCallback onTap,
      ) {
    final width = MediaQuery.of(context).size.width;
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          CircleAvatar(
            radius: width * 0.08,
            backgroundColor: Colors.black12,
            backgroundImage: AssetImage(imagePath),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: TextStyle(fontSize: width * 0.035, color: Colors.black),
          ),
        ],
      ),
    );
  }

}
