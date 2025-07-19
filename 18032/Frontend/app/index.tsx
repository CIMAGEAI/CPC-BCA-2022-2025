import Logo from '@/components/Logo';
import { UserContext } from '@/context/UserContext';
import axios from 'axios';
import { useNavigation } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useContext, useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

export default function Splash() {
    const navigation = useNavigation<any>();
    const userContext = useContext(UserContext);

    useEffect(() => {
        async function checkAuthAndLoadUser() {
            try {
                const token = await SecureStore.getItemAsync('jwt_token');
                if (token) {
                    const response = await axios.get('https://bd7t5d9s-5000.inc1.devtunnels.ms/user/getUserDetails',{
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (response.status === 200 && response.data) {
                        const userMap = {
                            name: response.data.name,
                            phoneNumber: response.data.mobilenumber,
                            emailId: response.data.emailid,
                            bankName: response.data.bankname,
                            accountNumber: response.data.accountnumber,
                            ifscCode: response.data.ifsccode,
                            upa: response.data.uniquepaymentaddress,
                            balance: response.data.accountbalance || 0,
                        };
                        userContext?.setUser && userContext.setUser(userMap);
                        userContext?.setBalance && userContext.setBalance(response.data.accountbalance || 0);
                        userContext?.setJwt && userContext.setJwt(token);
                        navigation.replace('(tabs)');
                    } else {
                        navigation.replace('Onboarding');
                    }
                } else {
                    navigation.replace('Onboarding');
                }
            } catch (err) {
                navigation.replace('Onboarding');
            }
        }
        checkAuthAndLoadUser();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'#E3F3FF'} />
            <View style={{ flexDirection: 'row', gap: 5 }}>
                <Logo />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E3F3FF',
    },
});