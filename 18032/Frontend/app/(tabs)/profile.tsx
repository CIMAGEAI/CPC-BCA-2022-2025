import { UserContext } from '@/context/UserContext';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import React, { useContext } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile():React.JSX.Element {
    const userContext = useContext(UserContext);
    const navigation = useNavigation<any>();
    const handleLogout = async () => {
        try {
                await SecureStore.deleteItemAsync('jwt_token');
                Alert.alert('Logged out', 'You have been logged out.');
                navigation.replace('(auth)/Login');
        } catch (err) {
            Alert.alert("Something went wrong")
        }
    };

    const user = userContext?.user;
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.sectionTitle}>Profile</Text>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Basic Details</Text>
                <View style={styles.detailRow}><Text style={styles.label}>Name:</Text><Text style={styles.value}>{user?.name || '-'}</Text></View>
                <View style={styles.detailRow}><Text style={styles.label}>Phone:</Text><Text style={styles.value}>{user?.phoneNumber || '-'}</Text></View>
                <View style={styles.detailRow}><Text style={styles.label}>Email:</Text><Text style={styles.value}>{user?.emailId || '-'}</Text></View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Bank Details</Text>
                <View style={styles.detailRow}><Text style={styles.label}>Bank Name:</Text><Text style={styles.value}>{user?.bankName || '-'}</Text></View>
                <View style={styles.detailRow}><Text style={styles.label}>Account No.:</Text><Text style={styles.value}>{user?.accountNumber || '-'}</Text></View>
                <View style={styles.detailRow}><Text style={styles.label}>IFSC:</Text><Text style={styles.value}>{user?.ifscCode || '-'}</Text></View>
                <View style={styles.detailRow}><Text style={styles.label}>UPA:</Text><Text style={styles.value}>{user?.upa || '-'}</Text></View>
            </View>

            <View style={styles.section}>
                <Pressable style={styles.pinChangeButton} onPress={() => navigation.navigate('(screens)/PINChange')}>
                    <Text style={styles.pinChangeText}>Change PIN</Text>
                </Pressable>
                <Pressable style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    sectionTitle: {
        fontSize: 32,
        fontFamily: 'Urbanist_Bold',
        textAlign: 'center',
        marginBottom: 24,
        marginTop: 10,
    },
    section: {
        backgroundColor: '#F5F7FA',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionHeader: {
        fontSize: 20,
        fontFamily: 'Urbanist_Bold',
        marginBottom: 10,
        color: '#1D71EF',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontFamily: 'Urbanist_Bold',
        fontSize: 16,
        color: '#333',
    },
    value: {
        fontFamily: 'Urbanist_Regular',
        fontSize: 16,
        color: '#555',
    },
    pinChangeButton: {
        backgroundColor: '#1D71EF',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    pinChangeText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Urbanist_Bold',
    },
    logoutButton: {
        backgroundColor: '#FF4D4F',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    logoutText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Urbanist_Bold',
    },
});