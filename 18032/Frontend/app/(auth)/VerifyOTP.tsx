import Logo from "@/components/Logo";
import { UserContext } from "@/context/UserContext";
import { getOTP, login } from "@/services/authAPI";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";

export default function Login() {
  const navigation = useNavigation<any>();
  const route=useRoute();
 const userContext = useContext(UserContext);
  const phoneNumber: string = route.params?.phoneNumber;
  const [otp, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  
async function handleLogin() {
    const regex = /^[0-9]{6}$/;
    if (regex.test(otp) && otp.length === 6) {
      setLoading(true);
      setShowBankModal(true);
      const response = await login(phoneNumber, otp);
      if (response.status === 200) {
        if (response.status === 200 && response.jwt && response.sessionId) {
          await SecureStore.setItemAsync('jwt_token', response.jwt);
          await SecureStore.setItemAsync('session_id', response.sessionId);
            setShowBankModal(false);
            if (response.userDetails && userContext?.setUser) {
              const mappedUser = {
                name: response.userDetails.name,
                phoneNumber: response.userDetails.mobilenumber, 
                emailId: response.userDetails.emailid,          
                bankName: response.userDetails.bankname,        
                accountNumber: response.userDetails.accountnumber, // <-- lowercase
                ifscCode: response.userDetails.ifsccode,        
                upa: response.userDetails.uniquepaymentaddress, 
                balance: response.userDetails.accountbalance,   
              };
              userContext?.setUser(mappedUser);
            }
            if (response.userDetails && userContext?.setBalance) {
              userContext.setBalance(response.userDetails.balance || 0);
            }
            if (userContext?.setJwt) {
              userContext.setJwt(response.jwt);
            }
            if (userContext?.setSessionId) {
              userContext.setSessionId(response.sessionId);
            }
            setLoading(false);
        }
      } else {
        setShowBankModal(false);
        setLoading(false);
        Alert.alert(
          "Verification Failed",
          "The OTP you entered is incorrect.",
          [
            { text: "Retry", onPress: () => {
              Alert.alert("Final attempt",
                "This is your last attempt",
                [
                  { text: 'OK', onPress: () => getOTP(phoneNumber) }
                ]
              );
            } },
            { text: "Cancel", style: "cancel" }
          ],
          { cancelable: false }
        );
      }
    }
}


// Navigate to home only after userContext.user is set
useEffect(() => {
  if (userContext?.user && !loading) {
    navigation.replace('(tabs)');
  }
}, [userContext?.user, loading]);

  return (
    <View style={styles.container}>
      <Modal
        visible={showBankModal}
        transparent
        animationType="fade"
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 32, alignItems: 'center', elevation: 8 }}>
            <ActivityIndicator size="large" color="#1D71EF" style={{ marginBottom: 16 }} />
            <Text style={{ fontSize: 18, fontFamily: 'Urbanist_Bold', color: '#1D71EF', marginBottom: 8 }}>Getting confirmation from bank...</Text>
            <Text style={{ fontSize: 15, fontFamily: 'Urbanist_Regular', color: '#333' }}>Verifying user and fetching account details</Text>
          </View>
        </View>
      </Modal>
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
                  <Text style={{textAlign:'left',fontSize:15,fontFamily:'Urbanist_SemiBold',marginLeft:10}}>OTP</Text>
                  <TextInput textContentType='oneTimeCode' 
                    maxLength={6} 
                    secureTextEntry 
                    keyboardType='numeric' 
                    keyboardAppearance='dark'  
                    placeholder='Enter OTP'
                    onEndEditing={(e)=>setOTP(e.nativeEvent.text)}
                    style={styles.inputBox}
                  />
                    <Text style={{fontSize:12,textAlign:'left',fontFamily:'Urbanist_Bold',marginLeft:10}}>{`OTP sent on +91 ${phoneNumber}`}</Text>
        </View>
                <Pressable style={styles.loginButton} onPress={handleLogin} disabled={loading}>
                  {loading ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                      <ActivityIndicator size='small' color="#fff" style={{ marginRight: 10 }} />
                      {/* <Text style={{ color: 'white', fontSize: 18, fontFamily: 'Urbanist_Bold' }}>Verifying</Text> */}
                    </View>
                  ) : (
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 18, fontFamily: 'Urbanist_Bold' }}>Login</Text>
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
    width: "100%",
    margin: 10,
  },
  inputBox: {
    height: 50,
    width: "95%",
    borderColor:'#A4D2FD' ,
    borderWidth: 0.2,
    marginTop: 5,
    marginLeft:10,
    padding: 10,
    fontFamily: 'Urbanist_Regular',
    fontSize:15,
    borderRadius: 12,
  },
  loginButton:{
     height:50,
     justifyContent:'center',
     borderRadius:50,
     marginTop:30,
     width:'50%',
     backgroundColor:'#1D71EF'
  },
});
