import { Image, StyleSheet, Text, View } from 'react-native';

export default function Logo(props:any){
    return (
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
           <Image source={require('../assets/images/logo.png')} style={styles.image} resizeMode='contain' />
           <Text style={[styles.titleCard,{fontSize:props.fontSize?props.fontSize:40}]}>Fincomp</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    titleCard:{
        fontSize:32,
        marginLeft:5,
        fontFamily:'Urbanist_SemiBold'
    },
    image:{
        height:48,
        width:48
    }
});