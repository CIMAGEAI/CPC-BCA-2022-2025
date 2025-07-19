//import liraries
import { StyleSheet, Text, View } from 'react-native';

export default function PaymentHistory(){
    return (
        <View style={styles.container}>
            <Text>PaymentHistory</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});