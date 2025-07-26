import { UserContext } from '@/context/UserContext';
import { getMerchantTransactionHistory } from '@/services/transactionAPI';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

const { height } = Dimensions.get('window');

export default function Bills() {
  const navigation = useNavigation<any>();
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const jwt = userContext?.jwt;
  const [merchantHistory, setMerchantHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMerchantHistory() {
      if (!user?.upa || !jwt) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await getMerchantTransactionHistory(user.upa, jwt);
        setMerchantHistory(data.slice(0, 4));
      } catch (e) {
        Alert.alert(
          "Error", 
          "Unable to load bill payment history.",
          [{ text: "OK" }]
        );
        setMerchantHistory([]);
      }
      setLoading(false);
    }
    fetchMerchantHistory();
  }, [user?.upa, jwt]);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.header}>Pay Bills & Recharge</Text>
        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.payButton, { backgroundColor: '#1D71EF22' }]}
            android_ripple={{ color: '#1D71EF33' }}
            onPress={() => navigation.navigate('(screens)/MobileRecharge')}
          >
            <MaterialCommunityIcons name='cellphone' size={36} color={'#1D71EF'} />
            <Text style={styles.buttonText}>Mobile Recharge</Text>
          </Pressable>
          <Pressable
            style={[styles.payButton, { backgroundColor: '#F5A62322' }]}
            android_ripple={{ color: '#F5A62333' }}
            onPress={() => navigation.navigate('(screens)/DTH')}
          >
            <MaterialCommunityIcons name='satellite-variant' size={36} color={'#F5A623'} />
            <Text style={styles.buttonText}>DTH</Text>
          </Pressable>
          <Pressable
            style={[styles.payButton, { backgroundColor: '#3DD59822' }]}
            android_ripple={{ color: '#3DD59833' }}
            onPress={() => navigation.navigate('(screens)/Electricity')}
          >
            <MaterialCommunityIcons name='flash' size={36} color={'#3DD598'} />
            <Text style={styles.buttonText}>Electricity</Text>
          </Pressable>
          <Pressable
            style={[styles.payButton, { backgroundColor: '#4A90E222' }]}
            android_ripple={{ color: '#4A90E233' }}
            onPress={() => navigation.navigate('(screens)/WaterBill')}
          >
            <MaterialCommunityIcons name='water' size={36} color={'#4A90E2'} />
            <Text style={styles.buttonText}>Water Bill</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.bottomSection}>
        <Text style={styles.recentHeader}>Recent Activities</Text>
        {loading ? (
          <View style={{ justifyContent: 'center', alignItems: 'center', height: 120 }}>
            <ActivityIndicator size={30} color={'#1D71EF'} />
          </View>
        ) : merchantHistory.length === 0 ? (
          <View style={{ justifyContent: 'center', alignItems: 'center', height: 120 }}>
            <Text style={{ color: '#86919E', fontFamily: 'Urbanist_Regular', fontSize: 16, marginTop: 30 }}>
              No recent merchant transactions.
            </Text>
          </View>
        ) : (
          <FlatList
            data={merchantHistory}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item }) => (
              <Pressable
                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 8, width: '95%' }}
                onPress={() => navigation.navigate('(screens)/PaymentInfo', {
                  name: item.name,
                  image: item.image,
                  date: item.date,
                  time: item.time,
                  amount: item.amount,
                  transactionId: item.transactionId,
                })}
              >
                <Image source={item.image} style={{ height: 40, width: 40, borderRadius: 100, borderWidth: 1, borderColor: '#B2D6FF' }} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{ fontFamily: 'Urbanist_SemiBold', fontSize: 16 }}>{item.name}</Text>
                  <Text style={{ fontFamily: 'Urbanist_Regular', fontSize: 12, color: '#86919E' }}>{item.date} {item.time}</Text>
                </View>
                <Text style={{ fontFamily: 'Urbanist_SemiBold', fontSize: 18, color: 'red' }}>{item.amount}</Text>
              </Pressable>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FB' },
  topSection: { height: height * 0.6, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 26, fontFamily: 'Urbanist_Bold', marginVertical: 20, color: '#1D71EF' },
  buttonRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 18 },
  payButton: {
    width: 140,
    height: 110,
    borderRadius: 18,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: { fontFamily: 'Urbanist_SemiBold', fontSize: 16, marginTop: 10, color: '#222' },
  bottomSection: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 18,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
  },
  recentHeader: { fontFamily: 'Urbanist_SemiBold', fontSize: 18, color: '#1D71EF', marginLeft: 18, marginBottom: 8 },
});
