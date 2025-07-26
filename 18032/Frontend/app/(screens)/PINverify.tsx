import { UserContext } from '@/context/UserContext';
import { makeMerchantPayment, makePayment } from '@/services/transactionAPI';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function PINverify() {
  const navigation = useNavigation<any>();
  const userContext = useContext(UserContext);
  const jwt = userContext?.jwt;
  const route = useRoute<any>();
  const { upa, amount, notes, isMerchantTransaction, serviceType, metadata, merchantUPA } = route.params;
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  async function handleVerify() {
    if (pin.length === 6) {
      setLoading(true);
      let result;
      if (isMerchantTransaction) {
        result = await makeMerchantPayment(
          amount,
          userContext?.user?.upa,
          merchantUPA,
          serviceType,
          metadata,
          pin,
          userContext?.jwt,
        );
      } else {
        result = await makePayment(amount, userContext?.user?.upa, upa, pin, jwt);
      }
      if (result && (result.status === 200 || result.message === 'Transaction successfull')) {
        if (result.message && result.senderBalance && result.transactionDetails) {
          if (userContext?.setBalance) {
            userContext.setBalance(result.senderBalance);
          }
          setLoading(false);
        }
        setAttempts(0); // reset attempts on success
        navigation.navigate('(screens)/ConfirmationPage', {
          message: result.message,
          senderBalance: result.senderBalance,
          transactionDetails: result.transactionDetails,
          notes: notes || '-',
          amount: result.transactionDetails.amount,
          refId: result.transactionDetails.transactionid || result.transactionDetails.transactionID || 'N/A',
          date: new Date(result.transactionDetails.transactiontime).toLocaleDateString(),
          time: new Date(result.transactionDetails.transactiontime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      } else {
        setLoading(false);
        setPin(''); // Clear the PIN after a failed transaction
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        // Show specific backend error alerts for common cases
        if (result && result.message) {
          if (result.status === 401) {
            alert('The PIN you entered is incorrect. Please try again.\nAtempts left: ' + (3-newAttempts)  );
          } else if (result.message === 'Insufficient balance') {
            alert('You do not have enough balance to complete this transaction.');
          } else if (result.message === 'User not found') {
            alert('User not found. Please contact support.');
          } else {
            alert(result.message);
          }
        } else {
          alert("Payment failed. Please try again.");
        }
        if (newAttempts >= 3) {
          alert('You have entered the wrong PIN 3 times. Please start the transaction again.');
          setAttempts(0);
          navigation.goBack(); // or navigate to SendPage or Home as needed
        }
      }
    }
  }

  const renderPinCircles = () => {
    const circles = [];
    for (let i = 0; i < 6; i++) {
      circles.push(
        <View
          key={i}
          style={[
            styles.pinCircle,
            { backgroundColor: pin.length > i ? '#1D71EF' : '#E3F3FF', borderColor: pin.length > i ? '#1D71EF' : '#A4D2FD' }
          ]}
        />
      );
    }
    return <View style={styles.pinCirclesRow}>{circles}</View>;
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) setPin(pin + num);
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}> 
        <StatusBar backgroundColor={'#E3F3FF'} barStyle={'dark-content'} />
        <ActivityIndicator color={'1D71EF'} size={30}/>
        <Text style={{ fontFamily: 'Urbanist_SemiBold', fontSize: 20, color: '#1D71EF' }}>Processing Payment...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#E3F3FF'} barStyle={'dark-content'} />
      <Text style={styles.header}>Enter UPA PIN</Text>
      <Text style={styles.subHeader}>Enter your 6-digit UPA PIN to proceed</Text>
      {renderPinCircles()}
      <View style={styles.numpad}>
        {[1,2,3,4,5,6,7,8,9].map((num) => (
          <Pressable key={num} style={styles.key} onPress={() => handleKeyPress(num.toString())}>
            <Text style={styles.keyText}>{num}</Text>
          </Pressable>
        ))}
        <View style={styles.key} />
        <Pressable style={styles.key} onPress={() => handleKeyPress('0')}>
          <Text style={styles.keyText}>0</Text>
        </Pressable>
        <Pressable style={styles.key} onPress={handleBackspace}>
          <MaterialCommunityIcons name="backspace-outline" size={28} color="#1D71EF" />
        </Pressable>
      </View>
      <Pressable style={[styles.submitButton, { opacity: pin.length === 6 ? 1 : 0.5 }]} 
      disabled={pin.length !== 6}
      onPress={handleVerify}>
        <Text style={styles.submitButtonText} >Pay</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F3FF',
    alignItems: 'center',
    paddingTop: 60,
  },
  header: {
    fontFamily: 'Urbanist_SemiBold',
    fontSize: 28,
    marginBottom: 10,
    color: '#1D71EF',
  },
  subHeader: {
    fontFamily: 'Urbanist_Regular',
    fontSize: 16,
    color: '#667085',
    marginBottom: 30,
  },
  pinCirclesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  pinCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginHorizontal: 10,
  },
  numpad: {
    width: '80%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 40,
  },
  key: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.5%',
    backgroundColor: '#fff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  keyText: {
    fontSize: 26,
    color: '#1D71EF',
    fontFamily: 'Urbanist_SemiBold',
  },
  submitButton: {
    backgroundColor: '#1D71EF',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 60,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Urbanist_Bold',
  },
});
