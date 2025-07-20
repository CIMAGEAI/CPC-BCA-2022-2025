import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:provider/provider.dart';
import 'package:quickfix/view/screens/explore_screen.dart';
import 'package:quickfix/view/screens/home_screen.dart';
import 'package:quickfix/view/screens/splash/splash_screen.dart';
import 'package:quickfix/view_model/cart_view_model.dart';
import 'package:quickfix/view_model/home_view_model.dart';
import 'package:quickfix/view_model/onboarding_view_model.dart';
import 'package:quickfix/view_model/profile_view_model.dart';
import 'package:quickfix/view_model/saved_view_model.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(const QuickFixApp());
}

class QuickFixApp extends StatelessWidget {
  const QuickFixApp({super.key});

  @override
  Widget build(BuildContext context) {

    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => OnboardingViewModel()),
        ChangeNotifierProvider(create: (_) => HomeViewModel()),
        ChangeNotifierProvider(create: (_) => SavedViewModel()),
        ChangeNotifierProvider(create: (_) => CartViewModel()),
        ChangeNotifierProvider(create: (_) => ProfileViewModel()),
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'QuickFix',
        theme: ThemeData(
          primarySwatch: Colors.teal,
          scaffoldBackgroundColor: Colors.white,
        ),
        home: FirebaseAuth.instance.currentUser != null
            ? const HomeScreen()
            : const SplashScreen(),
        routes: {
          '/cleaning': (context) => ExploreScreen(),
          '/electrician': (context) => ExploreScreen(),
          '/plumber': (context) => ExploreScreen(),
          '/repair': (context) => ExploreScreen(),
          '/beauty': (context) => ExploreScreen(),
          '/more': (context) => ExploreScreen(),
        },

      ),
    );
  }
}
