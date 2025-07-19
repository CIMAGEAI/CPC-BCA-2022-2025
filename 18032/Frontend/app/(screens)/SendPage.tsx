import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type SendPageParams = {
  name: string;
  upa: string;
  phoneNumber: string;
  image: any;
};

export default function Sendpage(): React.JSX.Element {
  const route = useRoute<any>();
  const [amount, setAmount] = useState<number>();
  const [amountInput, setAmountInput] = useState<string>("");
  const [amountError, setAmountError] = useState<boolean>(false);
  const [notes,setNotes]=useState('');
  const {name,upa,phoneNumber,image} = route.params;
  const navigation = useNavigation<any>();

  const handleAmountChange = (text: string) => {
    setAmountInput(text);
    const amountRegex = /^(?!0\d)\d{1,7}(\.\d{0,2})?$/;
    if (text.length === 0) {
      setAmount(undefined);
      setAmountError(false);
      return;
    }
    if (amountRegex.test(text)) {
      const num = parseFloat(text);
      setAmount(!isNaN(num) ? num : undefined);
      setAmountError(false);
    } else {
      setAmount(undefined);
      setAmountError(true);
    }
  };

  const handleAmountBlur = () => {
    const amountRegex = /^(?!0\d)\d{1,7}(\.\d{0,2})?$/;
    if (amountRegex.test(amountInput)) {
      setAmountError(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.paymentInfo}>
        <Image source={image} style={styles.paymentInfoImage} />
        <View>
          <Text style={{ fontFamily: "Urbanist_SemiBold", fontSize: 16 }}>
            {name}
          </Text>
          <Text style={{ fontFamily: 'Urbanist_Regular', fontSize: 12, color: '#86919E', marginTop: 2 }}>
            {phoneNumber}
          </Text>
        </View>
      </View>

       <View style={styles.amountView}> 
        <Text style={{fontFamily:'Urbanist_Regular',fontSize:12,color:'#86919E'}}>Amount</Text>
         <TextInput
            style={[styles.amountText, amountError ? { borderColor: 'red', borderWidth: 1, borderRadius: 8 } : {}]}
            keyboardType='numeric'
            maxLength={10}
            placeholder="Enter amount"
            value={amountInput}
            onChangeText={handleAmountChange}
            onBlur={handleAmountBlur}
         />
        {amountError && (
          <Text style={{ color: 'red', fontSize: 12 }}>Enter a valid amount (up to 2 decimals)</Text>
        )}
        <View style={styles.inputUnderline} />
       </View>
        <View style={styles.amountView}> 
        <Text style={{fontFamily:'Urbanist_Regular',fontSize:12,color:'#86919E'}}>Notes</Text>
         <TextInput style={styles.notesText}
            placeholder="Write your note here.."
            multiline
            numberOfLines={3}
            maxLength={100}
            value={notes}
            onChangeText={(text)=>setNotes(text)}
         />
       </View>
       <Pressable
         style={styles.nextButton}
         onPress={() => {
           if (!amount || isNaN(amount) || amount <= 0) {
             setAmountError(true);
             return;
           }
           navigation.navigate('(screens)/PINverify', { upa, amount, phoneNumber, notes });
         }}
       >
         <Text style={{color:'white',textAlign:'center',fontSize:18,fontFamily:'Urbanist_Bold'}}>Next</Text>
       </Pressable>
    </View>    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10,
    
  },
  userDetails: {},
  paymentInfo: {
    flexDirection: "row",
    // justifyContent: "space-around",
    alignItems: "center",
    marginTop:35,
    padding:10,
    backgroundColor:'white',
    borderWidth: 0.2,
    borderColor: "grey",
    borderRadius: 16,
    height: 75,
    width: "100%",
    alignSelf: "center",
  },
  paymentInfoImage: {
    height: 40,
    width: 40,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 100,
    marginRight:10
  },
  amountView:{
    // flexDirection: "row",
    justifyContent:'flex-start',
    alignItems: 'flex-start',
    margin: 20,
    padding:20,
    backgroundColor:'white',
    borderWidth: 0.2,
    borderColor: "grey",
    borderRadius: 16,
    height: 150,
    width: "100%",
    alignSelf: "center",
  },
  amountText:{
    fontFamily:'Urbanist_SemiBold',
    fontSize:32
  },
  bottomLine:{
    color:'blue',
    fontFamily:'Urbanist_SemiBold',
    fontSize:32
  },
  notesText:{
    fontFamily:'Urbanist_Medium',
    fontSize:20
  },
  inputUnderline: {
    height: 2,
    backgroundColor: '#1D71EF', // or any color you want
    width: '100%',
    marginTop: 4,
    borderRadius: 2,
},
nextButton:{
    height:50,
    justifyContent:'center',
    alignSelf:'center',
    // alignContent:'flex-end',
    borderRadius:100,
    marginTop:30,
    width:'75%',
    backgroundColor:'#1D71EF'
},
});
