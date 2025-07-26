import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

export default function PaymentInfo() {
  const route = useRoute<any>();
  const { name, image, date, time, amount, transactionId } = route.params || {};
  const [saving, setSaving] = React.useState(false);
  const cardRef = React.useRef<View>(null);

  async function handleDownloadReceipt() {
    try {
      setSaving(true);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
        setSaving(false);
        return;
      }
      const uri = await captureRef(cardRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Receipts', asset, false);
      setSaving(false);
      alert('Receipt saved to gallery!');
    } catch (e) {
      setSaving(false);
      alert('Failed to save receipt.');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card} ref={cardRef} collapsable={false}>
        <Image source={image} style={styles.profileImage} />
        <Text style={styles.name}>{name}</Text>
        <Text style={[styles.amount, { color: amount && amount.startsWith('-') ? 'red' : 'green' }]}>{amount}</Text>
        <View style={styles.row}>
          <MaterialCommunityIcons name='calendar' color={'#86919E'} size={20} />
          <Text style={styles.infoText}>{Array.isArray(date) ? date.join(' ') : date}</Text>
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons name='clock' color={'#86919E'} size={20} />
          <Text style={styles.infoText}>{time}</Text>
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons name='identifier' color={'#86919E'} size={20} />
          <Text style={styles.infoText}>Txn ID: {transactionId}</Text>
        </View>
      </View>
      <Pressable
        style={styles.downloadButton}
        onPress={handleDownloadReceipt}
        disabled={saving}
      >
        <MaterialCommunityIcons name='download' size={22} color='#fff' />
        <Text style={styles.downloadButtonText}>{saving ? 'Saving...' : 'Download Receipt (PNG)'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: 320,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: '#1D71EF',
    marginBottom: 10,
  },
  name: {
    fontFamily: 'Urbanist_SemiBold',
    fontSize: 22,
    marginBottom: 8,
    color: '#1D71EF',
  },
  amount: {
    fontFamily: 'Urbanist_Bold',
    fontSize: 28,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'Urbanist_Regular',
    fontSize: 16,
    color: '#667085',
    marginLeft: 8,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D71EF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 24,
    alignSelf: 'center',
    elevation: 2,
  },
  downloadButtonText: {
    color: '#fff',
    fontFamily: 'Urbanist_SemiBold',
    fontSize: 16,
    marginLeft: 10,
  },
});
