import { useNavigation } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const COMPANIES = [
  { name: 'NBPDCL', upa: 'nbpdcl@fincomp' },
  { name: 'SBPDCL', upa: 'sbpdcl@fincomp' },
  { name: 'BESCOM', upa: 'bescom@fincomp' },
  { name: 'Tata Power', upa: 'tatapower@fincomp' },
  { name: 'Adani Electricity', upa: 'adanielectricity@fincomp' },
  { name: 'MSEB', upa: 'mseb@fincomp' },
];

export default function Electricity() {
  const navigation = useNavigation<any>();
  const [selectedCompany, setSelectedCompany] = useState(COMPANIES[0]);
  const [amount, setAmount] = useState('');
  const [consumerId, setConsumerId] = useState('');
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
      serviceType: 'Electricity Bill',
      amount: Number(amount),
      merchantUPA: selectedCompany.upa,
      metadata: {
        company: selectedCompany.name,
        consumerId: consumerId,
      },
      notes: `${selectedCompany.name} Bill Payment for Consumer ID: ${consumerId}`,
    });
  };

  return (
    <ScrollView style={{ backgroundColor: '#F7F9FB' }} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>Electricity Bill</Text>
      <Text style={styles.info}>Select your company, enter Consumer ID and amount:</Text>
      <View style={styles.formCard}>
        <Text style={styles.label}>Company</Text>
        <View style={styles.dropdown}>
          {COMPANIES.map((company) => (
            <Pressable
              key={company.name}
              style={[styles.dropdownItem, selectedCompany.name === company.name && styles.dropdownItemSelected]}
              onPress={() => setSelectedCompany(company)}
            >
              <Text style={{ color: selectedCompany.name === company.name ? '#1D71EF' : '#222', fontFamily: 'Urbanist_Regular' }}>{company.name}</Text>
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
        {error ? <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text> : null}
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
    color: '#3DD598',
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
    color: '#1D71EF',
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
    borderColor: '#1D71EF',
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
  payButton: {
    backgroundColor: '#3DD598',
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
