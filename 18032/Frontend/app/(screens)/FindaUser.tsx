import { UserContext } from '@/context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, FlatList, Image, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

export default function FindaUser(){
    const navigation = useNavigation<any>();
    const [users, setUsers] = useState<any[]>([]);
    const userContext = useContext(UserContext);
    const jwt = userContext?.jwt;
    type User = { name: string; image: any , uniquepaymentaddress: string, mobilenumber?: string };
    
   useEffect(() => {
    async function fetchUsers() {
      try {
        const result = await axios.get('https://bd7t5d9s-5000.inc1.devtunnels.ms/user/all',{
            headers:{Authorization: `Bearer ${jwt}`},
        });
        const data = await result.data;
        const myUpa = userContext?.user?.upa;
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
          "Connection Error", 
          "Unable to load users. Showing demo users instead.",
          [{ text: "OK" }]
        );
        setUsers([
          { name: "Aarav", image: require('../../assets/images/profile_pic.jpg') },
          { name: "Priya", image: require('../../assets/images/profile_pic.jpg') },
          { name: "Rohan", image: require('../../assets/images/profile_pic.jpg') },
          { name: "Meera", image: require('../../assets/images/profile_pic.jpg') },
          { name: "Kabir", image: require('../../assets/images/profile_pic.jpg') },
          { name: "Isha", image:  require('../../assets/images/profile_pic.jpg') },
        ]);
      }
    }
    fetchUsers();
  }, []);
    const [search, setSearch] = useState("");
    const [foundUser, setFoundUser] = useState<any>(null);

    const handleSearch = (text: string) => {
        setSearch(text);
        if (text.length === 0) {
            setFoundUser(null);
            return;
        }
        const user = users.find(
            user=> user.name.toLowerCase() === text.toLowerCase() ||
                 user.upa.toLowerCase() === text.toLowerCase() ||
                 user.phoneNumber === text
        );
        setFoundUser(user || null);
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'transparent'} barStyle={'dark-content'} />
            <Text style={styles.headerText}>Find Recipient</Text>
            <View style={styles.findRecipient}>
                <Ionicons name='search' color={'#191B1E'} size={30} />
                <TextInput
                    placeholder='Search recipient here...'
                    style={styles.searchRecipientInput}
                    value={search}
                    onChangeText={handleSearch}
                    autoCapitalize='none'
                />
            </View>
            {foundUser && (
                <Pressable
                    style={styles.profileCard}
                    onPress={() => navigation.navigate('(screens)/SendPage',  { name:foundUser.name, upa:foundUser.upa, phoneNumber:foundUser.phoneNumber, image:foundUser.image })}
                >
                    <Image source={foundUser.image} style={styles.profileCardImage} />
                    <View style={{ marginLeft: 12 }}>
                        <Text style={{ fontFamily: 'Urbanist_SemiBold', fontSize: 18 }}>{foundUser.name}</Text>
                        <Text style={{ fontFamily: 'Urbanist_Regular', fontSize: 14, color: '#86919E' }}>{foundUser.upa}</Text>
                    </View>
                </Pressable>
            )}
            {!foundUser && <Text style={styles.recentHeaderText}>Recent</Text>}
            {!foundUser && (
                <FlatList
                    data={users}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ alignSelf: 'flex-start' }}
                    style={styles.recentUsersList}
                    renderItem={({ item, index }) => {
                        return (
                            <Pressable
                                style={styles.flatListItemView}
                                onPress={() => navigation.navigate('(screens)/SendPage', { name:item.name, upa:item.upa, phoneNumber:item.phoneNumber, image:item.image })}
                            >
                                <Image source={item.image} style={styles.recentUserImage} />
                                <Text style={{ fontFamily: 'Urbanist_Regular', fontSize: 15 }}>{item.name}</Text>
                            </Pressable>
                        );
                    }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 5,
        justifyContent: 'flex-start',
        alignItems: 'center',

    },
    headerText:{
        fontFamily: 'Urbanist_SemiBold',
        fontSize: 24,
        marginTop: 20,
        // marginBottom: 10,
        alignSelf: 'center',
        // textAlign:'center',
        // marginLeft: 20, // or paddingHorizontal: 20
    },
    recentHeaderText:{
        fontFamily:'Urbanist_SemiBold',
        fontSize:16,
        alignSelf:'flex-start',
        margin:10
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F9FB',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#B2D6FF',
        padding: 16,
        marginTop: 20,
        marginBottom: 10,
        width: '95%',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    profileCardImage: {
        height: 60,
        width: 60,
        borderRadius: 100,
        borderColor: 'black',
        borderWidth: 1,
    },
    flatListItemView:{
        justifyContent:'center',
        alignItems:'center',
        margin:5
    },
    recentUsersList:{
        backgroundColor:'white',
        height:100,
        width:'100%',
        alignSelf:'flex-start',
        marginTop:10,
    },
    recentUserImage:{
        height:60,
        width:60,
        borderColor:'black',
        borderWidth:1,
        borderRadius:100
    },
    findRecipient:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '95%',
        height: 50,
        borderColor: '#A4D2FD',
        borderWidth: 0.2,
        borderRadius: 12,
        paddingHorizontal: 10,
        marginTop: 20,
        alignSelf: 'center',
    },
    searchRecipientInput:{
        height: 50,
        width: '90%',
        // borderColor: '#A4D2FD',
        // borderWidth: 0.2,
        marginTop: 5,
        padding: 10,
        fontFamily: "Urbanist_Medium",
        borderRadius: 12,
    }
});
