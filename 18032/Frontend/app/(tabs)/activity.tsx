import { UserContext } from '@/context/UserContext';
import { getFullTransactionHistory } from '@/services/transactionAPI';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function Activity() {
  const userContext = useContext(UserContext);
  const upa = userContext?.user?.upa;
  const jwt = userContext?.jwt;
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    async function fetchHistory() {
      if (!upa || !jwt) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await getFullTransactionHistory(upa, jwt);
        setPaymentHistory(data);
      } catch (error) {
        Alert.alert(
          "Error", 
          "Unable to load transaction history. Please try again.",
          [{ text: "OK" }]
        );
        setPaymentHistory([]);
      }
      setLoading(false);
    }
    fetchHistory();
  }, [upa, jwt]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}> 
        <ActivityIndicator size={40} color={'#1D71EF'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={paymentHistory}
        style={{ flexGrow: 1 ,marginTop: 10}}
        keyExtractor={(_, idx) => idx.toString()}
        scrollEnabled
        renderItem={({ item }) => (
          <Pressable
            style={styles.paymentInfo}
            onPress={() => navigation.navigate('(screens)/PaymentInfo', {
              name: item.name,
              image: item.image,
              date: item.date,
              time: item.time,
              amount: item.amount,
              transactionId: item.transactionId,
            })}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '50%' }}>
              <Image source={item.image} style={styles.paymentInfoImage} />
              <View>
                <Text style={{ fontFamily: 'Urbanist_SemiBold', fontSize: 16 }}>{item.name}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontFamily: 'Urbanist_Regular', fontSize: 12, color: '#86919E' }}>
                    <MaterialCommunityIcons name='calendar' color={'#86919E'} size={15} />
                    {item.date}
                  </Text>
                  <Text style={{ fontFamily: 'Urbanist_Regular', fontSize: 12, color: '#86919E', textAlign: 'center' }}>
                    <MaterialCommunityIcons name='clock' color={'#86919E'} size={15} />
                    {item.time}
                  </Text>
                </View>
              </View>
            </View>
            <Text
              style={{
                fontFamily: 'Urbanist_SemiBold',
                fontSize: 20,
                color: item.amount && item.amount.startsWith('-') ? 'red' : 'green',
              }}
            >
              {item.amount}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:10,
    // marginTop:10,
    backgroundColor:'#FFFFFF'
  },
  paymentInfo:{
      flexDirection:'row',
      justifyContent:'space-around',
      alignItems:'center',
      margin:5,
      borderWidth:0.2,
      borderColor:'grey',
      borderRadius:16,
      height:75,
      width:'100%',
      alignSelf:'center'
    },
    paymentInfoImage:{
      height:40,
      width:40,
      borderColor:'black',
      borderWidth:1,
      borderRadius:100
    },
});
