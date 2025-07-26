import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import { useRef } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

export default function ConfirmationPage() {
  const receiptRef = useRef(null);
  const handleGetReceipt = async () => {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        alert('Permission to access media library is required!');
        return;
      }
      const uri = await captureRef(receiptRef, {
        format: 'png',
        quality: 1,
      });
      await MediaLibrary.saveToLibraryAsync(uri);
      alert('Receipt saved to gallery!');
    } catch (error) {
      alert('Failed to save receipt.');
    }
  };
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {message,senderBalance,refId,amount,date,time,note} = route.params;
  const status = message || 'Success';
  const notes = note || '-';
  if(message&&amount&&refId&&date&&time&&senderBalance){
  return (
    <View style={styles.screen}>
      {/* Receipt area to capture */}
      <View ref={receiptRef} collapsable={false} style={styles.card}>
      <StatusBar backgroundColor={'#F7F9FB'} barStyle={'dark-content'} />
      {/* ...existing code... */}
        <View style={styles.successIconContainer}>
          <View style={styles.successIconBg}>
            <MaterialCommunityIcons name="check-circle" size={48} color="#3DD598" />
          </View>
          <Text style={styles.paymentSuccess}>{status}</Text>
          <Text style={styles.amount}>{`₹${amount}`}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailsHeaderRow}>
          <Text style={styles.detailsHeader}>Details</Text>
          <MaterialCommunityIcons name="chevron-down" size={24} color="#86919E" />
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Status</Text>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <MaterialCommunityIcons name="check-circle" size={18} color="#3DD598" />
            <Text style={styles.detailsValueSuccess}>{status}</Text>
          </View>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Ref ID</Text>
          <Text style={styles.detailsValue}>{refId}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Date</Text>
          <Text style={styles.detailsValue}>{date}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Time</Text>
          <Text style={styles.detailsValue}>{time}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Sender Balance</Text>
          <Text style={styles.detailsValue}>{`₹${senderBalance}`}</Text>
        </View>
        {/* <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Receiver Balance</Text>
          <Text style={styles.detailsValue}>{`₹${receiverBalance}`}</Text>
        </View> */}
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Note</Text>
          <Text style={styles.detailsValue}>{notes}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Amount</Text>
          <Text style={styles.amountDetails}>{`₹${amount}`}</Text>
        </View>
        {/* <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Fee</Text>
          <Text style={styles.detailsValue}>-</Text>
        </View> */}
        <View style={styles.bottomDivider} />
        <Pressable style={styles.receiptButton} onPress={handleGetReceipt}>
          <Text style={styles.receiptButtonText}>Get Receipt</Text>
        </Pressable>
      </View>
      <Pressable style={styles.sendButton} onPress={() => navigation.replace('(tabs)')}>
        <Text style={styles.sendButtonText} >Home</Text>
      </Pressable>
    </View>
  );
}
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F9FB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#B2D6FF',
    padding: 18,
    width: '95%',
    alignSelf: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  successIconBg: {
    backgroundColor: '#E6F9F0',
    borderRadius: 100,
    padding: 10,
    marginBottom: 8,
  },
  paymentSuccess: {
    fontFamily: 'Urbanist_SemiBold',
    fontSize: 16,
    color: '#86919E',
    marginBottom: 2,
  },
  amount: {
    fontFamily: 'Urbanist_Bold',
    fontSize: 36,
    color: '#1D71EF',
    marginBottom: 8,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#B2D6FF',
    marginVertical: 8,
  },
  detailsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailsHeader: {
    fontFamily: 'Urbanist_SemiBold',
    fontSize: 15,
    color: '#86919E',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  detailsLabel: {
    fontFamily: 'Urbanist_Regular',
    fontSize: 14,
    color: '#86919E',
    width: 90,
  },
  detailsValue: {
    fontFamily: 'Urbanist_Regular',
    fontSize: 14,
    color: '#191B1E',
    flex: 1,
    textAlign: 'right',
  },
  detailsValueSuccess: {
    fontFamily: 'Urbanist_SemiBold',
    fontSize: 14,
    color: '#3DD598',
    marginLeft: 4,
  },
  amountDetails: {
    fontFamily: 'Urbanist_Bold',
    fontSize: 18,
    color: '#1D71EF',
    textAlign: 'right',
  },
  bottomDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#B2D6FF',
    marginVertical: 12,
  },
  receiptButton: {
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 2,
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B2D6FF',
    backgroundColor: '#F7F9FB',
  },
  receiptButtonText: {
    color: '#1D71EF',
    fontFamily: 'Urbanist_SemiBold',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#1D71EF',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 80,
    alignSelf: 'center',
    marginTop: 10,
    shadowColor: '#1D71EF',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  sendButtonText: {
    color: '#fff',
    fontFamily: 'Urbanist_Bold',
    fontSize: 20,
    textAlign: 'center',
  },
});
