import { useNavigation } from 'expo-router';
import { Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function Onboarding1(){
    const navigation=useNavigation<any>();
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#A4D2FD'} barStyle={'dark-content'} />
            <View style={styles.upperContainer}>
                <Image source={require('../assets/images/creditCard.png')} style={styles.crediCard} resizeMode='contain' />
            </View>
            <View style={styles.lowerContainer}>
                <Text style={styles.header}>Fast, Simple, Secure Transfers</Text>
                <Text style={styles.message} numberOfLines={3}>Transfer or receive funds at any time and from any location in just a matter of seconds.</Text>
                    <Pressable style={styles.loginButton} onPress={()=>navigation.navigate('(auth)/Login')}>
                        <Text style={{color:'white',textAlign:'center',fontSize:18,fontFamily:'Urbanist_Bold'}}>Login</Text>
                    </Pressable>
                    <Pressable style={[styles.loginButton,{backgroundColor:'#E3F3FF',marginTop:20}]}
                        onPress={()=>navigation.navigate('(auth)/SignUp')}>
                        <Text style={styles.signUpText}>Register</Text>
                    </Pressable>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white'
    },
    upperContainer:{
        height:'50%',
        width:'100%',
        backgroundColor: '#A4D2FD',
        borderBottomLeftRadius:'10%',
        borderBottomRightRadius:'10%',
        justifyContent:'center',
        alignItems:'center'
    },
    lowerContainer:{
        height:'50%',
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        padding:10,
    },
    crediCard:{
        height:'100%',
        width:'100%'
    },
    header:{
        fontFamily:'Urbanist_SemiBold',
        textAlign:'center',
        fontSize:32
    },
    message:{
        fontFamily:'Urbanist_Medium',
        fontSize:14,
        color:'#667085',
        textAlign:'center'
    },
    loginButton:{
        height:50,
        justifyContent:'center',
        borderRadius:100,
        marginTop:30,
        width:'85%',
        backgroundColor:'#1D71EF'
    },
    signUpText:{
        color:'#69A9FB',
        textAlign:'center',
        fontSize:18,
        fontFamily:'Urbanist_Bold'
    }
});