import { UserContext } from '@/context/UserContext';
import axios from 'axios';
import { useNavigation } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function PINChange() {
  const navigation = useNavigation<any>();
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const jwt = userContext?.jwt;
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePin = async () => {
    if (!oldPin || !newPin || !confirmPin) {
      setError('All fields are required');
      return;
    }
    if (newPin !== confirmPin) {
      setError('New PIN and Confirm PIN do not match');
      return;
    }
    if (newPin.length !== 6 || isNaN(Number(newPin))) {
      setError('PIN must be a 6-digit number');
      return;
    }
    if (!user?.upa || !jwt) {
      setError('User not authenticated');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(
        'https://bd7t5d9s-5000.inc1.devtunnels.ms/transaction/changeTransactionPIN',
        {
          upa: user.upa,
          oldPIN: oldPin,
          newPIN: newPin,
        },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      if (res.status === 200) {
        Alert.alert('Success', 'Your PIN has been changed.');
        navigation.goBack();
      } else {
        setError(res.data?.message || 'Failed to change PIN');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to change PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Change PIN</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Old PIN"
        secureTextEntry
        keyboardType="numeric"
        value={oldPin}
        onChangeText={setOldPin}
        maxLength={6}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter New PIN"
        secureTextEntry
        keyboardType="numeric"
        value={newPin}
        onChangeText={setNewPin}
        maxLength={6}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New PIN"
        secureTextEntry
        keyboardType="numeric"
        value={confirmPin}
        onChangeText={setConfirmPin}
        maxLength={6}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.button} onPress={handleChangePin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Changing...' : 'Change PIN'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    fontSize: 28,
    fontFamily: 'Urbanist_Bold',
    color: '#1D71EF',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E3F3FF',
    padding: 14,
    fontSize: 18,
    fontFamily: 'Urbanist_Regular',
    marginBottom: 14,
  },
  error: {
    color: '#FF4D4F',
    fontFamily: 'Urbanist_Regular',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1D71EF',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 60,
    marginTop: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Urbanist_Bold',
  },
});
