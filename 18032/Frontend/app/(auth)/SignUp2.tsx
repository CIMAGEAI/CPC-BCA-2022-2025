import { UserContext } from "@/context/UserContext";
import { signUp } from "@/services/authAPI";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import { useContext, useEffect, useRef, useState } from "react";
import { Alert, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function SignUp2() {
    const navigation = useNavigation<any>();
    const userContext = useContext(UserContext);
    const route = useRoute();
    const reEnterAccountNumberInputRef = useRef<any>(null);
    const [reEnteredAccountNumber, setreEnteredAccountNumber] = useState('');
    const { userId='',name = '', email = '', phoneNumber = '' } = (route.params && (route.params as any).form) || {};
    const [previousAccountNumber, setPreviousAccountNumber] = useState<string>('');

    const bankNameRegex = /^[a-zA-Z0-9 .&'-]{2,}$/;
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
    const accountNumberRegex = /^\d{9,18}$/;
    const tpinRegex = /^\d{6}$/;

    const [form, setForm] = useState({
        bankName: '',
        ifscCode: '',
        accountNumber: '',
        TPIN: '',
        upa: `${phoneNumber}@fincomp`
    });

    const isBankNameValid = bankNameRegex.test(form.bankName);
    const isIFSCValid = ifscRegex.test(form.ifscCode);
    const isAccountNumberValid = accountNumberRegex.test(previousAccountNumber);
    const isReAccountNumberValid = previousAccountNumber === reEnteredAccountNumber && reEnteredAccountNumber.length > 0;
    const isTPINValid = tpinRegex.test(form.TPIN);
    const isFormValid = isBankNameValid && isIFSCValid && isAccountNumberValid && isReAccountNumberValid && isTPINValid;

async function handleRegister() {
        const data = {
            userId,
            name,
            mobileNumber: phoneNumber,
            emailID: email,
            bankName: form.bankName,
            accountNumber: form.accountNumber,
            ifscCode: form.ifscCode,
            uniquePaymentAddress: form.upa,
            accountBalance: 10000,
            transactionPIN: form.TPIN,
        };
        try {
            const response = await signUp(data);
            if (response.status === 201 && response.jwt) {
                await SecureStore.setItemAsync('jwt_token', response.jwt)
                if (response.userDetails && userContext?.setUser) {
                    const mappedUser = {
                        name: response.userDetails.name,
                        phoneNumber: response.userDetails.mobilenumber,
                        emailId: response.userDetails.emailid,
                        bankName: response.userDetails.bankname,
                        accountNumber: response.userDetails.accountnumber,
                        ifscCode: response.userDetails.ifsccode,
                        upa: response.userDetails.uniquepaymentaddress,
                        balance: response.userDetails.accountbalance,
                    };
                    userContext.setUser(mappedUser);
                }
                if (response.userDetails && userContext?.setBalance) {
                    userContext.setBalance(response.userDetails.accountbalance || 0);
                }
                if (response.jwt && userContext?.setJwt) {
                    userContext.setJwt(response.jwt);
                }
            } else {
                Alert.alert('Registration failed', response.message || 'Please try again.');
            }
        } catch (error) {
            Alert.alert('Registration error', 'An error occurred during registration.');
        }
    }


// Navigate to home only after userContext.user is set
useEffect(() => {
  if (userContext?.user) {
    navigation.replace('(tabs)');
  }
}, [userContext?.user]);

    function handleAccountNumberInput() {
        if (previousAccountNumber === reEnteredAccountNumber) {
            setForm(prev => ({ ...prev, accountNumber: reEnteredAccountNumber }));
            if (reEnterAccountNumberInputRef.current) {
                reEnterAccountNumberInputRef.current.setNativeProps({
                    style: {
                        borderColor: '#A4D2FD',
                        borderWidth: 0.2
                    }
                });
            }
            return;
        } else {
            Alert.alert("Account number doesn't match");
            setreEnteredAccountNumber('');
            if (reEnterAccountNumberInputRef.current) {
                reEnterAccountNumberInputRef.current.setNativeProps({
                    style: {
                        borderColor: 'red',
                        borderWidth: 1
                    }
                });
            }
        }
    }
    const handleChange = (key: string, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={'transparent'} barStyle='dark-content' />
            <View style={styles.formWrapper}>
                <Text style={[styles.sectionTitle]}>Bank details</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Bank Name</Text>
                    <TextInput
                        value={form.bankName}
                        onChangeText={(text) => handleChange('bankName', text)}
                        placeholder='Bank Name'
                        style={[styles.inputBox, !isBankNameValid && form.bankName.length > 0 ? { borderColor: 'red', borderWidth: 1 } : {}]}
                    />
                    {!isBankNameValid && form.bankName.length > 0 && (
                        <Text style={styles.errorText}>Enter a valid bank name</Text>
                    )}
                </View>
                <View style={[styles.inputContainer]}>
                    <Text style={styles.label}>IFSC code</Text>
                    <View style={[styles.mobileInputContainer]} >
                        <TextInput
                            value={form.ifscCode}
                            onChangeText={(text) => handleChange('ifscCode', text)}
                            placeholder='IFSC code number'
                            maxLength={20}
                            style={[styles.mobileInput, !isIFSCValid && form.ifscCode.length > 0 ? { borderColor: 'red', borderWidth: 1 } : {}]}
                            autoCapitalize='characters'
                        />
                    </View>
                    {!isIFSCValid && form.ifscCode.length > 0 && (
                        <Text style={styles.errorText}>Enter a valid IFSC code (e.g. SBIN0001234)</Text>
                    )}
                </View>
                <View style={[styles.inputContainer]}>
                    <Text style={styles.label}>Account number</Text>
                    <View style={[styles.mobileInputContainer]}>
                        <TextInput
                            secureTextEntry
                            placeholder='Account Number'
                            maxLength={18}
                            keyboardType='numeric'
                            value={previousAccountNumber}
                            onChangeText={(text)=>setPreviousAccountNumber(text)}
                            style={[styles.mobileInput, !isAccountNumberValid && previousAccountNumber.length > 0 ? { borderColor: 'red', borderWidth: 1 } : {}]}
                        />
                    </View>
                    {!isAccountNumberValid && previousAccountNumber.length > 0 && (
                        <Text style={styles.errorText}>Enter a valid account number (9-18 digits)</Text>
                    )}
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Re-enter Account Number</Text>
                    <TextInput
                        value={reEnteredAccountNumber}
                        onChangeText={(text)=>setreEnteredAccountNumber(text)}
                        onBlur={handleAccountNumberInput}
                        ref={reEnterAccountNumberInputRef}
                        keyboardType='numeric'
                        placeholder='Re-enter Account Number'
                        style={[styles.inputBox, !isReAccountNumberValid && reEnteredAccountNumber.length > 0 ? { borderColor: 'red', borderWidth: 1 } : {}]}
                    />
                    {!isReAccountNumberValid && reEnteredAccountNumber.length > 0 && (
                        <Text style={styles.errorText}>Account numbers do not match</Text>
                    )}
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Unique Payment Address</Text>
                    <TextInput value={`${phoneNumber}@fincomp`} style={styles.inputBox} editable={false}/>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>TPIN (6 digit PIN)</Text>
                    <TextInput
                        textContentType='password'
                        secureTextEntry
                        value={form.TPIN}
                        onChangeText={(text) => handleChange('TPIN', text)}
                        maxLength={6}
                        placeholder='TPIN'
                        keyboardType='numeric'
                        style={[styles.inputBox, !isTPINValid && form.TPIN.length > 0 ? { borderColor: 'red', borderWidth: 1 } : {}]}
                    />
                    {!isTPINValid && form.TPIN.length > 0 && (
                        <Text style={styles.errorText}>Enter a valid 6-digit PIN</Text>
                    )}
                </View>
                <Pressable
                    style={[styles.button, { backgroundColor: isFormValid ? '#1D71EF' : 'grey' }]}
                    onPress={isFormValid ? handleRegister : undefined}
                    disabled={!isFormValid}
                >
                    <Text style={styles.buttonText}>Register</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:10,
        backgroundColor:'#FFFFFF',
    },
    inputContainer:{
        // height:50,
        padding:5,
        width:'100%',
        margin:10,
        justifyContent:'center',
        alignItems:'baseline',
    },
    sectionTitle: {
        fontSize: 25,
        textAlign: 'center',
        marginTop: 20,
        textDecorationLine: 'underline',
        fontFamily: 'Urbanist_Bold',
    },
    label: {
        fontSize: 15,
        textAlign: 'right',
        fontFamily: 'Urbanist_Bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'right',
        fontFamily: 'Urbanist_Bold',
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
        fontSize:20
    },
    mobileInputContainer:{
        // padding:5,
        width:'95%',
        height:55,
        // margin:10,
        marginTop:5,
        // padding:5,
        flexDirection:'row',
        // justifyContent:'center',
        alignItems:'center',
        borderColor:'#A4D2FD' ,
        borderWidth: 0.2,
        padding: 10,
        fontFamily: 'Urbanist_Regular',
        fontSize:15,
        borderRadius: 12,
    },
    formWrapper: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 24,
    },
    button: {
        height: 50,
        justifyContent: 'center',
        borderRadius: 50,
        marginTop: 10,
        width: '50%',
        backgroundColor: '#1D71EF',
        alignSelf: 'center',
        alignItems: 'center',
    },
    // Removed unused verifyButton style
});