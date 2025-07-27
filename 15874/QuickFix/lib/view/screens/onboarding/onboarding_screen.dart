import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lottie/lottie.dart';
import 'package:quickfix/view/screens/auth/login_screen.dart';
import 'package:quickfix/view/screens/splash/splash_screen.dart';
import '../../../view_model/onboarding_view_model.dart';

class OnboardingPage extends StatelessWidget {
  const OnboardingPage({super.key});

  @override
  @override
  Widget build(BuildContext context) {
    final onboardingVM = Provider.of<OnboardingViewModel>(context);
    final width = MediaQuery.of(context).size.width;
    final height = MediaQuery.of(context).size.height;

    final List<String> animations = [
      'assets/lottie/service4.json',
      'assets/lottie/service6.json',
      'assets/lottie/register.json',
    ];

    final PageController controller = PageController();

    return Scaffold(
      body: SafeArea(
        child: SizedBox(
          height: height,
          width: width,
          child: Column(
            children: [
              Expanded(
                child: PageView.builder(
                  controller: controller,
                  onPageChanged: onboardingVM.updatePage,
                  itemCount: animations.length,
                  itemBuilder: (context, index) {
                    return SingleChildScrollView(
                      padding: EdgeInsets.symmetric(horizontal: width * 0.08),
                      child: ConstrainedBox(
                        constraints: BoxConstraints(minHeight: height * 0.8),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            SizedBox(height: height * 0.05),
                            Lottie.asset(
                              animations[index],
                              height: height * 0.4,
                              width: width,
                              fit: BoxFit.contain,
                            ),
                            // SizedBox(height: height * 0.05),
                            // Text(
                            //   "Service ${index + 1}",
                            //   style: TextStyle(
                            //     fontSize: width * 0.06,
                            //     fontWeight: FontWeight.bold,
                            //   ),
                            // ),
                            // SizedBox(height: height * 0.02),
                            // Text(
                            //   "This is a short description for Service ${index + 1}.",
                            //   textAlign: TextAlign.center,
                            //   style: TextStyle(
                            //     fontSize: width * 0.04,
                            //     color: Colors.grey[600],
                            //   ),
                            // ),
                            // SizedBox(height: height * 0.05),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),

              // Page Indicator
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(animations.length, (index) {
                  return AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    margin: const EdgeInsets.symmetric(horizontal: 5),
                    width: onboardingVM.currentPage == index ? 12 : 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: onboardingVM.currentPage == index
                          ? Colors.teal
                          : Colors.grey,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  );
                }),
              ),

              SizedBox(height: height * 0.03),

              // Skip & Next / Continue Buttons
              Padding(
                padding: EdgeInsets.symmetric(horizontal: width * 0.1),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    ElevatedButton(
                      onPressed: onboardingVM.currentPage < 2
                          ? () => controller.jumpToPage(2)
                          : null,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.grey[300],
                        foregroundColor: Colors.black87,
                      ),
                      child: const Text("Skip"),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        if (onboardingVM.currentPage == 2) {
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const LoginScreen(),
                            ),
                          );
                        } else {
                          controller.nextPage(
                            duration: const Duration(milliseconds: 300),
                            curve: Curves.easeIn,
                          );
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.teal,
                        foregroundColor: Colors.white,
                      ),
                      child: Text(onboardingVM.currentPage == 2 ? "Continue" : "Next"),
                    ),
                  ],
                ),
              ),

              SizedBox(height: height * 0.03),
            ],
          ),
        ),
      ),
    );
  }

}
