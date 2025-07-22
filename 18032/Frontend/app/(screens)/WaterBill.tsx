
import { useNavigation } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const PROVIDERS = [
  { name: 'BWSSB', upa: 'bwssb@fincomp' },
  { name: 'Delhi Jal Board', upa: 'djb@fincomp' },
  { name: 'Chennai Metro Water', upa: 'cmwssb@fincomp' },
  { name: 'Hyderabad Water Board', upa: 'hwb@fincomp' },
  { name: 'Pune Municipal Corp', upa: 'pmc@fincomp' },
];

export default function WaterBill() {
  const navigation = useNavigation<any>();
  const [selectedProvider, setSelectedProvider] = useState(PROVIDERS[0]);
  const [consumerId, setConsumerId] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handlePay = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Enter a valid amount greater than 0');
      return;
    }
    if (!consumerId) {
      setError('Enter a valid Consumer ID');
      return;
    }
    setError('');
    navigation.navigate('(screens)/PINverify', {
      isMerchantTransaction: true,
      serviceType: 'Water Bill',
      amount: Number(amount),
      merchantUPA: selectedProvider.upa,
      metadata: {
        company: selectedProvider.name,
        consumerId: consumerId,
      },
      notes: `${selectedProvider.name} Water Bill for Consumer ID: ${consumerId}`,
    });
  };

  return (
    <ScrollView style={{ backgroundColor: '#F7F9FB' }} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>Water Bill</Text>
      <Text style={styles.info}>Pay your water bill instantly and securely.</Text>
      <View style={styles.formCard}>
        <Text style={styles.label}>Provider</Text>
        <View style={styles.dropdown}>
          {PROVIDERS.map((provider) => (
            <Pressable
              key={provider.name}
              style={[styles.dropdownItem, selectedProvider.name === provider.name && styles.dropdownItemSelected]}
              onPress={() => setSelectedProvider(provider)}
            >
              <Text style={{ color: selectedProvider.name === provider.name ? '#4A90E2' : '#222', fontFamily: 'Urbanist_Regular' }}>{provider.name}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.label}>Consumer ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Consumer ID"
          value={consumerId}
          onChangeText={setConsumerId}
          keyboardType="default"
        />
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable style={styles.payButton} onPress={handlePay}>
          <Text style={styles.payButtonText}>Pay Bill</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontFamily: 'Urbanist_Bold',
    color: '#4A90E2',
    marginBottom: 8,
    marginTop: 10,
  },
  info: {
    fontSize: 16,
    fontFamily: 'Urbanist_Regular',
    color: '#667085',
    textAlign: 'center',
    marginBottom: 18,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: {
    fontFamily: 'Urbanist_SemiBold',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 4,
    color: '#4A90E2',
  },
  dropdown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    gap: 8,
  },
  dropdownItem: {
    backgroundColor: '#F7F9FB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E3F3FF',
    marginRight: 8,
    marginBottom: 6,
  },
  dropdownItemSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#E3F3FF',
  },
  input: {
    backgroundColor: '#F7F9FB',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E3F3FF',
    fontFamily: 'Urbanist_Regular',
    fontSize: 16,
    marginBottom: 10,
    width: '100%',
  },
  error: {
    color: '#FF4D4F',
    fontFamily: 'Urbanist_Regular',
    marginBottom: 10,
    textAlign: 'center',
  },
  payButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 60,
    marginTop: 10,
    alignSelf: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Urbanist_Bold',
  },
});
