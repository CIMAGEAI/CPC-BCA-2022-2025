import Logo from "@/components/Logo";
import { getOTP } from "@/services/authAPI";
import { useNavigation } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";

export default  function Login() {
   const navigation = useNavigation<any>();
  const mobileNumberRef = useRef<TextInput>(null);
  const buttonRef = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSendOTP() {
    const regex = /^[0-9]{10}$/;
    if (!regex.test(phoneNumber ?? "") || phoneNumber?.length !== 10) {
      if (mobileNumberRef.current) {
        mobileNumberRef.current.setNativeProps({
          style: { borderColor: 'red', borderWidth: 1 }
        });
      }
    } else {
      if (mobileNumberRef.current) {
        mobileNumberRef.current.setNativeProps({
          style: { borderColor: 'green', borderWidth: 0.2 }
        });
      }
      setLoading(true);
      try {
        await getOTP(phoneNumber);
        navigation.replace('(auth)/VerifyOTP', { phoneNumber });
      } catch (error) {
        Alert.alert(
          "Error", 
          "Failed to send OTP. Please check your internet connection and try again.",
          [{ text: "OK" }]
        );
      } finally {
        setLoading(false);
      }
    }
  }

  const handlePhoneNumberChange = useCallback((text: string) => {
    setPhoneNumber(text);
    const regex = /^[0-9]{10}$/;
    setIsValid(regex.test(text));
  }, [phoneNumber]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#E3F3FF'} barStyle={'dark-content'}/>
      <View
        style={{
          flex: 5,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Logo />
      </View>

      <View style={styles.lowerContainer}>
        <Text style={styles.headingText}>LOGIN</Text>

        <View style={styles.inputContainer}>
                  <Text style={{textAlign:'left',fontSize:15,fontFamily:'Urbanist_SemiBold'}}>Mobile number [+91]</Text>
                  <TextInput
                    textContentType='telephoneNumber'
                    maxLength={10}
                    keyboardType='numeric'
                    keyboardAppearance='dark'
                    placeholder='Enter your bank registered mobile number'
                    ref={mobileNumberRef}
                    onChangeText={handlePhoneNumberChange}
                    value={phoneNumber}
                    style={styles.inputBox}
                  />
                </View>

                <Pressable
                  style={[styles.loginButton, { backgroundColor: (isValid && !loading) ? '#1D71EF' : 'grey' }]}
                  onPress={handleSendOTP}
                  ref={buttonRef}
                  disabled={!isValid || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 18, fontFamily: 'Urbanist_Bold' }}>Send OTP</Text>
                  )}
                </Pressable>

        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text style={{ color: "grey", marginTop: 20,fontSize:15,fontFamily:'Urbanist_Regular' }}>
            Don't have an account ?{" "}
          </Text>
          <Text
            style={{ color: "red", fontSize: 15,fontFamily:'Urbanist_Bold'}}
            onPress={() => navigation.navigate("(auth)/SignUp")}
          >
            Register
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F3FF",
  },
  lowerContainer: {
    flex: 5,
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  headingText: {
    fontSize: 35,
    fontFamily: "Urbanist_SemiBold",
    fontWeight: "600",
    textAlign: "center",
  },
  inputContainer: {
    padding: 5,
    width: "100%",
    margin: 10,
    alignItems: "center",
  },
  inputBox: {
    height: 50,
    width: "95%",
    borderColor:'#A4D2FD' ,
    borderWidth: 0.5,
    marginTop: 5,
    padding: 10,
    fontFamily: "Roboto_Regular",
    borderRadius: 12,
  },
  loginButton:{
     height:50,
     justifyContent:'center',
     borderRadius:50,
     marginTop:30,
     width:'50%',
     backgroundColor:'grey'
  },
});