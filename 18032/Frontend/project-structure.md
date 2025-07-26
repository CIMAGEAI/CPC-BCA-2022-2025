# Fincomp - React Native Mobile Payment App
## Project Structure

```
📁 Frontend/
├── 📄 app.json                          # Expo app configuration
├── 📄 eslint.config.js                  # ESLint configuration
├── 📄 expo-env.d.ts                     # Expo TypeScript declarations
├── 📄 package.json                      # Dependencies and scripts
├── 📄 README.md                         # Project documentation
├── 📄 tsconfig.json                     # TypeScript configuration
│
├── 📁 app/                              # Main application screens and navigation
│   ├── 📄 _layout.tsx                   # Root layout with navigation stack
│   ├── 📄 index.tsx                     # Splash screen with auto-login
│   ├── 📄 Onboarding.tsx                # Welcome/onboarding screen
│   │
│   ├── 📁 (auth)/                       # Authentication flow
│   │   ├── 📄 Login.tsx                 # Phone number & OTP login
│   │   ├── 📄 SignUp.tsx                # Registration - basic info
│   │   ├── 📄 SignUp2.tsx               # Registration - bank details
│   │   └── 📄 VerifyOTP.tsx             # OTP verification screen
│   │
│   ├── 📁 (tabs)/                       # Main app tabs (bottom navigation)
│   │   ├── 📄 _layout.tsx               # Tab navigation layout
│   │   ├── 📄 index.tsx                 # Home - dashboard & quick actions
│   │   ├── 📄 activity.tsx              # Transaction history
│   │   ├── 📄 bills.tsx                 # Bills & recharge services
│   │   └── 📄 profile.tsx               # User profile & settings
│   │
│   └── 📁 (screens)/                    # Feature screens
│       ├── 📄 ConfirmationPage.tsx      # Transaction success screen
│       ├── 📄 DTH.tsx                   # DTH recharge options
│       ├── 📄 Electricity.tsx           # Electricity bill payment
│       ├── 📄 FindaUser.tsx             # Search users for payment
│       ├── 📄 MobileRecharge.tsx        # Mobile recharge plans
│       ├── 📄 PaymentInfo.tsx           # Payment receipt details
│       ├── 📄 PayWithQR.tsx             # QR code scanner for payments
│       ├── 📄 PINChange.tsx             # Change transaction PIN
│       ├── 📄 PINverify.tsx             # PIN verification for payments
│       ├── 📄 SendPage.tsx              # Send money to user
│       ├── 📄 WaterBill.tsx             # Water bill payment
│       └── 📄 YourQR.tsx                # Display user's QR code
│
├── 📁 assets/                           # Static assets
│   ├── 📁 fonts/                        # Custom fonts
│   │   └── 📁 Urbanist/                 # Urbanist font family
│   │       ├── 📄 OFL.txt               # Font license
│   │       ├── 📄 README.txt            # Font documentation
│   │       ├── 📄 Urbanist-Italic-VariableFont_wght.ttf
│   │       ├── 📄 Urbanist-VariableFont_wght.ttf
│   │       └── 📁 static/               # Static font weights
│   │           ├── 📄 Urbanist-Black.ttf
│   │           ├── 📄 Urbanist-Bold.ttf
│   │           ├── 📄 Urbanist-Medium.ttf
│   │           ├── 📄 Urbanist-Regular.ttf
│   │           ├── 📄 Urbanist-SemiBold.ttf
│   │           └── 📄 ... (other weights)
│   │
│   └── 📁 images/                       # App images
│       ├── 📄 creditCard.png            # Onboarding illustration
│       ├── 📄 logo.png                  # App logo
│       └── 📄 profile_pic.jpg           # Default profile picture
│
├── 📁 components/                       # Reusable UI components
│   ├── 📄 Logo.tsx                      # App logo component
│   ├── 📄 Overlay.tsx                   # QR scanner overlay
│   └── 📄 PaymentHistory.tsx            # Payment history component
│
├── 📁 constants/                        # App constants
│   └── 📄 Colors.ts                     # Color theme definitions
│
├── 📁 context/                          # React Context providers
│   └── 📄 UserContext.tsx               # Global user state management
│
├── 📁 scripts/                          # Build and utility scripts
│   └── 📄 reset-project.js              # Expo project reset utility
│
└── 📁 services/                         # API and business logic
    ├── 📄 authAPI.ts                    # Authentication API calls
    ├── 📄 getBalance.ts                 # Balance retrieval with PIN
    ├── 📄 transactionAPI.js             # Payment transactions (JS)
    └── 📄 transactionAPI.ts             # Transaction history (TS)
```

## Architecture Overview

### 🏗️ **App Structure**
- **Expo Router** for file-based navigation
- **TypeScript** for type safety
- **React Native** for cross-platform mobile development

### 🔐 **Authentication Flow**
1. **Splash Screen** (`index.tsx`) - Auto-login check
2. **Onboarding** (`Onboarding.tsx`) - Welcome screen
3. **Login** (`Login.tsx`) - Phone number + OTP
4. **Registration** (`SignUp.tsx` + `SignUp2.tsx`) - Two-step signup
5. **OTP Verification** (`VerifyOTP.tsx`) - SMS verification

### 🏠 **Main App (Tabs)**
- **Home** - Dashboard, balance, quick actions
- **Bills** - Utility payments and recharges
- **Activity** - Transaction history
- **Profile** - User settings and logout

### 💰 **Payment Features**
- **P2P Transfers** - Send money to other users
- **QR Payments** - Scan or display QR codes
- **Bill Payments** - Electricity, water, DTH, mobile
- **Transaction History** - Complete payment records

### 🔧 **Technical Features**
- **Global State** - React Context for user data
- **Secure Storage** - JWT tokens and PIN storage
- **Error Handling** - User-friendly alerts
- **Loading States** - Activity indicators
- **Form Validation** - Real-time input validation

### 🎨 **UI/UX**
- **Custom Fonts** - Urbanist font family
- **Modern Design** - Clean, intuitive interface
- **Responsive Layout** - Optimized for mobile
- **Accessibility** - Screen reader friendly
