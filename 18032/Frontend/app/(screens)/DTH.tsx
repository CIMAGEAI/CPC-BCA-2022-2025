
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const OPERATORS = [
  {
    name: 'Tata Play',
    icon: 'television-classic',
    color: '#1D71EF',
    plans: [
      { amount: 300, desc: 'Monthly Family Pack' },
      { amount: 450, desc: 'Sports HD Pack' },
      { amount: 199, desc: 'Basic Hindi Pack' },
    ],
  },
  {
    name: 'Airtel Digital TV',
    icon: 'television',
    color: '#E71C23',
    plans: [
      { amount: 350, desc: 'HD Value Pack' },
      { amount: 500, desc: 'All-in-One Pack' },
      { amount: 220, desc: 'South Value Pack' },
    ],
  },
  {
    name: 'Dish TV',
    icon: 'satellite-variant',
    color: '#F5A623',
    plans: [
      { amount: 280, desc: 'Super Family Pack' },
      { amount: 399, desc: 'HD Premium Pack' },
      { amount: 180, desc: 'Basic Pack' },
    ],
  },
  {
    name: 'd2h',
    icon: 'television-box',
    color: '#4A90E2',
    plans: [
      { amount: 320, desc: 'HD Combo Pack' },
      { amount: 499, desc: 'All Sports Pack' },
      { amount: 210, desc: 'Family Saver Pack' },
    ],
  },
];

export default function DTH() {
  const navigation = useNavigation<any>();
  return (
    <ScrollView style={{ backgroundColor: '#F7F9FB' }} contentContainerStyle={styles.container}>
      <Text style={styles.header}>DTH Recharge</Text>
      <Text style={styles.info}>Select your DTH operator and choose a popular plan:</Text>
      {OPERATORS.map((operator) => (
        <View key={operator.name} style={styles.providerCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <MaterialCommunityIcons name={operator.icon as any} size={32} color={operator.color} />
            <Text style={[styles.providerName, { color: operator.color }]}>{operator.name}</Text>
          </View>
          <View style={styles.plansRow}>
            {operator.plans.map((plan, idx) => (
              <Pressable
                key={plan.amount + operator.name}
                style={styles.planButton}
                android_ripple={{ color: operator.color + '22' }}
                onPress={() => navigation.navigate('(screens)/PINverify', {
                  isMerchantTransaction: true,
                  serviceType: 'DTH Recharge',
                  amount: plan.amount,
                  merchantUPA: `${operator.name.toLowerCase().replace(/\s/g, '')}@fincomp`,
                  metadata: {
                    company: operator.name,
                    plan: plan.desc
                  },
                  notes: `${operator.name} Recharge: ${plan.desc}`,
                })}
              >
                <Text style={styles.planAmount}>{`₹${plan.amount}`}</Text>
                <Text style={styles.planDesc}>{plan.desc}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontFamily: 'Urbanist_Bold',
    color: '#F5A623',
    marginBottom: 8,
    marginTop: 10,
  },
  info: {
    fontSize: 16,
    fontFamily: 'Urbanist_Regular',
    color: '#667085',
    textAlign: 'center',
    marginBottom: 18,
  },
  providerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  providerName: {
    fontFamily: 'Urbanist_SemiBold',
    fontSize: 22,
    marginLeft: 10,
  },
  plansRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
  },
  planButton: {
    backgroundColor: '#F7F9FB',
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    marginBottom: 10,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E3F3FF',
    elevation: 1,
  },
  planAmount: {
    fontFamily: 'Urbanist_Bold',
    fontSize: 18,
    color: '#F5A623',
    marginBottom: 4,
  },
  planDesc: {
    fontFamily: 'Urbanist_Regular',
    fontSize: 13,
    color: '#667085',
    textAlign: 'center',
  },
});
