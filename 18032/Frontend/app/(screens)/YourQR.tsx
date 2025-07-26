import { UserContext } from '@/context/UserContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function YourQR():React.JSX.Element{
    const userContext = React.useContext(UserContext);
    const qrValue={
        upa: userContext?.user?.upa || 'N/A',
        name: userContext?.user?.name || 'Unknown User',
        phoneNumber: userContext?.user?.phoneNumber || 'N/A',
        image: require('../../assets/images/profile_pic.jpg'),
    };
    return (
        <View style={styles.container}>
            {/* <StatusBar barStyle={'light-content'} backgroundColor={'black'}/> */}
            <View style={styles.mainView}>
                <Text style={[{fontSize:22,marginBottom:20,fontWeight:'600'}]}>Scan this QR code to pay</Text>
                {/* <MaterialCommunityIcons name='qrcode' color={'black'} size={350} style={styles.qrCode} /> */}
                <QRCode value={JSON.stringify(qrValue)} size={300} />
                <Text style={styles.upaText}>{userContext?.user?.upa}</Text>
                <Text style={[{fontSize:22,marginTop:10,fontWeight:'600'}]}>{userContext?.user?.name}</Text>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent:'center',
        alignItems:'center',
    },
    mainView:{
        justifyContent:'center',
        alignItems:'center',
       
    },
    qrCode:{
        borderWidth:2,
        borderColor:'black',
        borderRadius:20
    },
    upaText:{
        fontSize:25,
        fontWeight:'700',
        marginTop:20
    }
});