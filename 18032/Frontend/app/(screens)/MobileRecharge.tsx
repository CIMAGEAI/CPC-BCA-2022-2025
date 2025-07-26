import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const PROVIDERS = [
  {
    name: 'Jio',
    icon: 'alpha-j-circle',
    color: '#0078FF',
    plans: [
      { amount: 239, desc: '28 days, 1.5GB/day, Unlimited Calls' },
      { amount: 666, desc: '84 days, 1.5GB/day, Unlimited Calls' },
      { amount: 299, desc: '28 days, 2GB/day, Unlimited Calls' },
    ],
  },
  {
    name: 'Airtel',
    icon: 'alpha-a-circle',
    color: '#E71C23',
    plans: [
      { amount: 265, desc: '28 days, 1GB/day, Unlimited Calls' },
      { amount: 719, desc: '84 days, 1.5GB/day, Unlimited Calls' },
      { amount: 299, desc: '28 days, 1.5GB/day, Unlimited Calls' },
    ],
  },
  {
    name: 'BSNL',
    icon: 'alpha-b-circle',
    color: '#008272',
    plans: [
      { amount: 107, desc: '35 days, 3GB total, 200min Calls' },
      { amount: 197, desc: '70 days, 2GB/day, Unlimited Calls' },
      { amount: 397, desc: '150 days, 2GB/day, Unlimited Calls' },
    ],
  },
  {
    name: 'VI',
    icon: 'alpha-v-circle',
    color: '#F5A623',
    plans: [
      { amount: 299, desc: '28 days, 1.5GB/day, Unlimited Calls' },
      { amount: 719, desc: '84 days, 1.5GB/day, Unlimited Calls' },
      { amount: 459, desc: '84 days, 6GB total, Unlimited Calls' },
    ],
  },
];

export default function MobileRecharge() {
  const navigation = useNavigation<any>();
  return (
    <ScrollView style={{ backgroundColor: '#F7F9FB' }} contentContainerStyle={styles.container}>
      <Text style={styles.header}>Mobile Recharge</Text>
      <Text style={styles.info}>Select your operator and choose a popular plan:</Text>
      {PROVIDERS.map((provider) => (
        <View key={provider.name} style={styles.providerCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <MaterialCommunityIcons name={provider.icon as any} size={32} color={provider.color} />
            <Text style={[styles.providerName, { color: provider.color }]}>{provider.name}</Text>
          </View>
          <View style={styles.plansRow}>
            {provider.plans.map((plan, idx) => (
              <Pressable
                key={plan.amount + provider.name}
                style={styles.planButton}
                android_ripple={{ color: provider.color + '22' }}
                onPress={() => navigation.navigate('(screens)/PINverify', {
                  isMerchantTransaction: true,
                  serviceType: 'Mobile Recharge',
                  amount: plan.amount,
                  merchantUPA: `${provider.name.toLowerCase()}@fincomp`,
                  metadata: {
                    company: provider.name,
                    plan: plan.desc
                  },
                  notes: `${provider.name} Recharge: ${plan.desc}`,
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
    color: '#1D71EF',
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
    color: '#1D71EF',
    marginBottom: 4,
  },
  planDesc: {
    fontFamily: 'Urbanist_Regular',
    fontSize: 13,
    color: '#667085',
    textAlign: 'center',
  },
});
