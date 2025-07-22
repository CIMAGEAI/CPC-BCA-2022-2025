import { UserProvider } from '@/context/UserContext';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const [loaded] = useFonts({
    Urbanist_Regular: require('../assets/fonts/Urbanist/static/Urbanist-Regular.ttf'),
    Urbanist_Bold: require('../assets/fonts/Urbanist/static/Urbanist-Bold.ttf'),
    Urbanist_SemiBold: require('../assets/fonts/Urbanist/static/Urbanist-SemiBold.ttf'),
    Urbanist_Black: require('../assets/fonts/Urbanist/static/Urbanist-Black.ttf'),
    Urbanist_Medium: require('../assets/fonts/Urbanist/static/Urbanist-Medium.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <UserProvider>
      <StatusBar backgroundColor={'black'} style='light' />
      <Stack >
        <Stack.Screen name="index" options={{headerShown:false}}/>
        <Stack.Screen name='Onboarding' options={{headerShown:false}}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/Login" options={{ headerShown: false }} />
        <Stack.Screen name='(auth)/VerifyOTP' options={{headerShown:false}}/>
        <Stack.Screen name="(auth)/SignUp" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/SignUp2" options={{ headerShown: false }} />
        <Stack.Screen name="(screens)/YourQR" options={{headerShown:false}}/>
        <Stack.Screen name="(screens)/PayWithQR" options={{headerShown:false}}/>
        <Stack.Screen name="(screens)/FindaUser" options={{headerShown:false}}/>
        <Stack.Screen name="(screens)/SendPage" options={{headerShown:false}}/>
        <Stack.Screen name="(screens)/PINverify" options={{headerShown:false}}/>
        <Stack.Screen name="(screens)/ConfirmationPage" options={{headerShown:false}}/>
        <Stack.Screen name="(screens)/PaymentInfo" options={{headerShown:false}}/>
        <Stack.Screen name="(screens)/MobileRecharge" options={{headerShown:false}}/>
        <Stack.Screen name="(screens)/DTH" options={{headerShown:false}}/>
        <Stack.Screen name="(screens)/Electricity" options={{headerShown:false}}/>
        <Stack.Screen name="(screens)/WaterBill" options={{headerShown:false}}/>
        <Stack.Screen name="(screens)/PINChange" options={{headerShown:false}}/>



      </Stack>
      <StatusBar style="auto" />
    </UserProvider>
  );
}
