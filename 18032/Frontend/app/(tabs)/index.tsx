import { UserContext } from '@/context/UserContext';
import { getTransactionHistory } from '@/services/transactionAPI';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { BlurView } from 'expo-blur';
import { useNavigation, } from 'expo-router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const jwt = userContext?.jwt;
  if (!user || !jwt) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size={40} color={'#1D71EF'} />
      </SafeAreaView>
    );
  }
  type User = {
    [x: string]: any; name: string; image: any , uniquepaymentaddress: string, mobilenumber?: string 
  };
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const result = await axios.get('https://bd7t5d9s-5000.inc1.devtunnels.ms/user/all', {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const data = await result.data;
        const myUpa = user?.upa;
        const mappedUsers = data
          .filter((user: User) => user.uniquepaymentaddress !== myUpa)
          .map((user: User) => ({
            name: user.name?.split(' ')[0] || '-',
            upa: user.uniquepaymentaddress,
            phoneNumber: user.mobilenumber,
            image: require('../../assets/images/profile_pic.jpg'),
          }));
        setUsers(mappedUsers);
      } catch (err) {
        Alert.alert(
          "Network Error", 
          "Unable to load recent users. Please check your connection.",
          [{ text: "OK" }]
        );
        setUsers([]);
      }
    }
    if (jwt && user) fetchUsers();
  }, [jwt, user]);

  const fetchBalanceAndHistory = useCallback(async () => {
    if (!user?.upa || !jwt) {
      setLoading(false);
      return;
    }
    setLoading(true);
    let oldBalance = userContext?.balance;
    try {
      const userRes = await axios.get('https://bd7t5d9s-5000.inc1.devtunnels.ms/user/getUserDetails', {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (userRes.status === 200 && userRes.data) {
        const newBalance = userRes.data.accountbalance || 0;
        userContext?.setBalance && userContext.setBalance(newBalance);
      }
    } catch (e:any) {
      alert(e.message || 'Failed to fetch user details');
    }
    const data = await getTransactionHistory(user.upa, jwt);
    setPaymentHistory(data.slice(0, 4));
    setLoading(false);
  }, [user?.upa, jwt, userContext]);

  useFocusEffect(
    useCallback(() => {
      fetchBalanceAndHistory();
    }, [fetchBalanceAndHistory])
  );

  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (!user?.upa || !jwt) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await getTransactionHistory(user.upa, jwt);
      setPaymentHistory(data.slice(0, 4));
      setLoading(false);
    }
    fetchHistory();
  }, [user?.upa, jwt]);
  const navigation=useNavigation<any>();

  return (
  <SafeAreaView style={styles.container}>
    <StatusBar backgroundColor={'white'} barStyle={'dark-content'} /> 
      <View style={{flexDirection:'row',justifyContent:'space-between',margin:5}}>
         <View>
            <Text style={{fontFamily:'Urbanist_Regular',fontSize:12,color:'grey'}}>Welcome,</Text>
            <Text style={{fontFamily:'Urbanist_Medium',fontSize:14,color:'black'}}>{userContext?.user?.name}</Text>
         </View> 
      </View>
     
     <View style={styles.toolView}>
      <View style={styles.balanceView}>
        <Text style={{fontFamily:'Urbanist_Regular',fontSize:12}}>Total Balance</Text>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:10}}>
        <Text style={{fontFamily:'Urbanist_SemiBold',fontSize:32}}>
          <MaterialCommunityIcons name='currency-inr' size={32} color={'grey'}/>
          {userContext?.balance != null ? userContext.balance : '0.00'}
        </Text>

        </View>
      </View>
    
    <View style={styles.paymentToolsView}>
      <BlurView style={styles.glassButton} intensity={40} tint='dark'>
        <MaterialCommunityIcons name='qrcode-scan' color={'#FFF'} onPress={()=>navigation.navigate('(screens)/PayWithQR')} size={45} />
        <Text style={{fontFamily:'Urbanist_SemiBold',textAlign:'center',fontSize:13,color:'#FFFF',marginLeft:5}}>Scan to Pay</Text>
      </BlurView>
      <BlurView style={styles.glassButton} intensity={40} tint='dark' >
        <MaterialCommunityIcons name='qrcode' color={'#FFF'} size={45} onPress={()=>navigation.navigate('(screens)/YourQR')} />
        <Text style={{fontFamily:'Urbanist_SemiBold',textAlign:'center',fontSize:14,color:'#FFFF',marginLeft:5}}>Your QR</Text>
      </BlurView>
      <BlurView style={styles.glassButton} intensity={40} tint='dark' >
        <MaterialCommunityIcons name='send' color={'#FFF'} size={45} onPress={()=>navigation.navigate('(screens)/FindaUser')}/>
        <Text style={{fontFamily:'Urbanist_SemiBold',textAlign:'center',fontSize:14,color:'#FFFF',marginLeft:5}}>Send</Text>
      </BlurView>
    </View>
  </View>

  <View style={styles.bottomView}>


    <View>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
        <Text style={{fontFamily:'Urbanist_SemiBold',fontSize:16}} >Recent Activities</Text>
        <Text style={{fontFamily:'Urbanist_SemiBold',fontSize:16,color:'#1D71EF'}} onPress={()=>navigation.navigate('activity')}>View all</Text>
      </View>
      {loading ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', height: 120 }}>
          <ActivityIndicator size={30} color={'#1D71EF'} />
        </View>
      ) : paymentHistory.length === 0 ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', height: 120 }}>
          <Text style={{ fontFamily: 'Urbanist_Regular', fontSize: 16, color: '#86919E' }}>No transactions to show</Text>
        </View>
      ) : (
        <FlatList
          data={paymentHistory}
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
      )}
    </View>
  </View>
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:5,
    backgroundColor:'white',
  },
  notificationBell:{
    height:25,
    width:25,
  },
  toolView:{
    borderColor:'#1D71EF',
    borderWidth:1,
    borderRadius:10,
    height:200,
    width:'95%',
    alignSelf:'center'
  },
  paymentToolsView:{
    height:'50%',
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    padding:5,
    borderBottomLeftRadius:8,
    borderBottomRightRadius:8,
    backgroundColor:'#1D71EF'
  },
  balanceView:{
    flex:2,
    padding:10
  },
  glassButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: 80,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    overflow: 'hidden',
  },
  bottomView:{
    padding:10
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
