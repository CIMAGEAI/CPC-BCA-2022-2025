import { Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const scanAreaSize = 250;

export default function Overlay() {
  const edgeLength = scanAreaSize;

  return (
    <View style={styles.overlay}>
      {/* Top */}
      <View style={{ ...styles.cover, height: (height - edgeLength) / 2 }} />

      {/* Middle */}
      <View style={{ flexDirection: 'row' }}>
        {/* Left */}
        <View style={{ ...styles.cover, width: (width - edgeLength) / 2 }} />
        {/* Transparent scan area with border */}
        <View style={styles.scanArea} />
        {/* Right */}
        <View style={{ ...styles.cover, width: (width - edgeLength) / 2 }} />
      </View>

      {/* Bottom */}
      <View style={{ ...styles.cover, height: (height - edgeLength) / 2 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 10,
  },
  cover: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scanArea: {
    width: scanAreaSize,
    height: scanAreaSize,
    borderColor: 'white',
    borderWidth: 2,
  },
});
