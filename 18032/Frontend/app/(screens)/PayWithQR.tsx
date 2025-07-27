import Overlay from '@/components/Overlay';
import { Camera, CameraView } from 'expo-camera';
import { useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';


export default  function PayWithQR(){
    const cameraRef = useRef(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [qrData, setQrData] = useState(null);
    const navigation=useNavigation<any>();
    useEffect(() => {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);

  const handleBarCodeScanned = ({ data }: any) => {
    if (!scanned && data) {
      setScanned(true);
      setQrData(data);
      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch (e) {
        alert('Invalid QR code');
        return;
      }
      navigation.navigate('(screens)/SendPage', {
        name: parsed.name || 'Unknown User',
        upa: parsed.upa,
        phoneNumber: parsed.phoneNumber || 'N/A',
        image: require('../../assets/images/profile_pic.jpg'),
      });
    }
  };

  if (hasPermission === null) return <Text>Requesting permission...</Text>;
  if (hasPermission === false) return <Text>No camera access</Text>;
    return (
        <View style={styles.container}>
            <Pressable >
                <Text>Request permission</Text>
            </Pressable>
            <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
                onBarcodeScanned={handleBarCodeScanned}
                barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
            //   enableTorch
            />
            <Overlay/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position:'relative'
    },
    overlay:{
        zIndex:2,
        position:'absolute',
        height:200,
        width:200,
        borderColor:'white',
        borderWidth:1,
        backgroundColor:'rgba(0, 0, 0, 0.5)',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius:40
    }
});