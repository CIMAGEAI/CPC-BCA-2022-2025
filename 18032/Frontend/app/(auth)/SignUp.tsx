import { getOTP, verifyOTP } from '@/services/authAPI';
import { useNavigation } from 'expo-router';
import { useRef, useState, } from 'react';
import { Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

export default function SignUp ():React.JSX.Element{
    const navigation=useNavigation<any>();
    const [form, setForm] = useState({
       userId:'', 
       name: '',
       email: '',
       phoneNumber:'',
    });
    const [sendOTP,setSendOTP]=useState<boolean>(true);
    const [verifyOTPBool,setVerifyOTPBool]=useState<boolean>(false);
    const [otp,setOTP]=useState<string | null>();
    const mobileInputContainerRef=useRef<any | null>(null);
    const otpInputRef=useRef<any | null>(null);


    const nameRegex = /^[a-zA-Z ]{2,}$/;
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    const isNameValid = nameRegex.test(form.name);
    const isEmailValid = emailRegex.test(form.email);
    const isPhoneValid = phoneRegex.test(form.phoneNumber);
    const isFormValid = isNameValid && isEmailValid && isPhoneValid;



async function handleSendOTP(){
        const regex = /^[0-9]$/;
        if(form.phoneNumber.length!==10 || regex.test(form.phoneNumber)){
            mobileInputContainerRef.current.setNativeProps({
                style:{borderColor:'red',borderWidth:1}
            });
            return;
        }
        else{
            mobileInputContainerRef.current.setNativeProps({
                style:{borderColor:'black'}
            });
            setSendOTP(false);
            const result=await getOTP(form.phoneNumber);
            setVerifyOTPBool(!verifyOTPBool);
            // startTimer();
        }
    }
async function handleVerifyOTP(otp:any){
        const regex = /^[0-9]{6}$/;
        if(!regex.test(otp) || otp.length!==6){
            otpInputRef.current.setNativeProps({
                style:{
                    borderColor:'red',
                    borderWidth:1
                }
            });
            return;
        }else{
            otpInputRef.current.setNativeProps({
                style:{
                    borderColor:'#A4D2FD',
                    borderWidth:0.2
                }
            })
            setVerifyOTPBool(!verifyOTPBool);
            const userId=await verifyOTP(form.phoneNumber, otp)
            handleChange('userId',userId);
            if(userId!== null){
                setVerifyOTPBool(!verifyOTPBool);
            }
        }
    }

const handleChange = (key:string, value:any) => {
   setForm(prev => ({ ...prev, [key]: value }));
};

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={'transparent'} barStyle='dark-content' />
            <Text style={styles.headingText}>SIGNUP</Text>
            <Text style={{fontSize:25,textAlign:'center', textDecorationLine:'underline',fontFamily:'Urbanist_Bold'}} >Basic details</Text>

            <View style={styles.inputContainer}>
                <Text style={{fontSize:15,textAlign:'right',fontFamily:'Urbanist_Bold'}}>Full Name</Text>
                <TextInput
                    textContentType='name'
                    value={form.name}
                    onChangeText={(text) => handleChange('name', text)}
                    placeholder='Full Name'
                    style={[styles.inputBox, !isNameValid && form.name.length > 0 ? { borderColor: 'red', borderWidth: 1 } : {}]}
                />
                {!isNameValid && form.name.length > 0 && (
                    <Text style={{ color: 'red', fontSize: 12 }}>Enter a valid name (letters and spaces only)</Text>
                )}
            </View>

            <View style={[styles.inputContainer]}>
                <Text style={{fontSize:15,textAlign:'right',fontFamily:'Urbanist_Bold'}}>Mobile number [+91]</Text>
                <View style={[styles.mobileInputContainer]} ref={mobileInputContainerRef}>
                    <TextInput
                        textContentType='telephoneNumber'
                        value={form.phoneNumber}
                        readOnly={!sendOTP}
                        onChangeText={(text) => handleChange('phoneNumber', text)}
                        placeholder='Mobile number'
                        maxLength={10}
                        keyboardType='numeric'
                        style={[styles.mobileInput, !isPhoneValid && form.phoneNumber.length > 0 ? { borderColor: 'red', borderWidth: 1 } : {}]}
                    />
                    {sendOTP ? (
                        <Pressable
                            style={[styles.verifyButton, { backgroundColor: isPhoneValid ? 'green' : 'grey' }]}
                            onPress={isPhoneValid ? handleSendOTP : undefined}
                            disabled={!isPhoneValid}
                        >
                            <Text style={{fontSize:12,textAlign:'right',color:'white',fontFamily:'Urbanist_Bold'}}>Send OTP</Text>
                        </Pressable>
                    ) : null}
                </View>
                {!isPhoneValid && form.phoneNumber.length > 0 && (
                    <Text style={{ color: 'red', fontSize: 12 }}>Enter a valid 10-digit mobile number</Text>
                )}
            </View>

            <View style={[styles.inputContainer]}>
                <Text style={{fontSize:15,textAlign:'right',fontFamily:'Urbanist_Bold'}}>OTP</Text>
                <View style={[styles.mobileInputContainer]} ref={otpInputRef}>
                    <TextInput
                        textContentType='oneTimeCode'
                        secureTextEntry
                        readOnly={!verifyOTP}
                        placeholder='OTP'
                        maxLength={6}
                        keyboardType='numeric'
                        style={[styles.mobileInput]}
                        onChangeText={(text)=>setOTP(text)}
                    />
                    {verifyOTPBool ? (
                        <Pressable style={styles.verifyButton} onPress={()=>handleVerifyOTP(otp)} >
                            <Text style={{fontSize:12,textAlign:'right',color:'white',fontFamily:'Urbanist_Bold'}}>Verify OTP</Text>
                        </Pressable>
                    ) : null}
                </View>
                {!sendOTP ? (
                    <View style={{flexDirection:'row',width:'100%',justifyContent:'space-around'}} >
                        <Text style={{fontSize:12,textAlign:'left',fontFamily:'Urbanist_Regular'}}>{`OTP sent on +91 ${form.phoneNumber}`}</Text>
                        {/* {resendOTP ? (
                            <Text style={{ color: "blue", fontSize: 12,fontFamily:'Urbanist_Bold'}} onPress={handleResendOTP}>
                                Resend OTP
                            </Text>
                        ) : (
                            <Text style={{fontSize:12,textAlign:'right',fontFamily:'Urbanist_Regular'}}>{`Resend OTP in ${formatTime(resendOTPTimer)}`}</Text>
                        )} */}
                    </View>
                ) : null}
            </View>

            <View style={styles.inputContainer}>
                <Text style={{fontSize:15,textAlign:'right',fontFamily:'Urbanist_Bold'}}>E-mail</Text>
                <TextInput
                    textContentType='emailAddress'
                    value={form.email}
                    onChangeText={(text) => handleChange('email', text)}
                    keyboardType='email-address'
                    placeholder='E-mail'
                    style={[styles.inputBox, !isEmailValid && form.email.length > 0 ? { borderColor: 'red', borderWidth: 1 } : {}]}
                />
                {!isEmailValid && form.email.length > 0 && (
                    <Text style={{ color: 'red', fontSize: 12 }}>Enter a valid email address</Text>
                )}
            </View>
            <Pressable
                style={[styles.button, { backgroundColor: isFormValid ? '#1D71EF' : 'grey' }]}
                onPress={() => navigation.navigate('(auth)/SignUp2', { form })}
                disabled={!isFormValid}
            >
                <Text style={{fontSize:18,color:'white',textAlign:'right',fontFamily:'Urbanist_Bold'}}>Next</Text>
            </Pressable>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#FFF'
    },
    inputContainer:{
        padding:5,
        width:'100%',
        margin:10,
        justifyContent:'center',
        alignItems:'baseline',
    },
    headingText: {
       fontSize: 40,
       fontFamily: "Urbanist_SemiBold",
       fontWeight: "600",
       textAlign: "center",
       margin:20
  },
     inputBox: {
       height: 50,
       width: "95%",
       borderColor:'#A4D2FD' ,
       borderWidth: 0.2,
       marginTop: 5,
       padding: 10,
       fontFamily: 'Urbanist_Regular',
       fontSize:15,
       borderRadius: 12,
  },
    mobileInput:{
        height:50,
        width:'60%',
        fontFamily:'Urbanist_Regular',
        fontSize:18
    },
    mobileInputContainer:{
        width:'95%',
        height:55,
        marginTop:5,
        flexDirection:'row',
        alignItems:'center',
        borderColor:'#A4D2FD' ,
        borderWidth: 0.2,
        padding: 10,
        fontFamily: 'Urbanist_Regular',
        fontSize:15,
        borderRadius: 12,
    },
    button:{
       height:50,
       justifyContent:'center',
       borderRadius:50,
       marginTop:30,
       width:'50%',
       backgroundColor:'#1D71EF',
       alignSelf:'center',
       alignItems:'center'
    },
    verifyButton:{
        height:40,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
        margin:5,
        borderRadius:10,
        width:'35%',
        backgroundColor:'green'
    }
});