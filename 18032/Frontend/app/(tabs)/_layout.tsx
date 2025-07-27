import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs screenOptions={{
          headerShown:false,
          tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
          tabBarStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
            position: 'absolute',
            borderTopWidth: 0,
            elevation: 0,
          },
          tabBarLabelStyle: { fontSize: 12, fontFamily: 'Urbanist_Regular' },
          tabBarIconStyle: { marginTop: 0, marginBottom: 0 },
          tabBarItemStyle: { paddingVertical: 5, paddingHorizontal: 10 },
          tabBarBackground: () => (
            <BlurView
              intensity={100}
              tint={colorScheme === 'dark' ? 'dark' : 'light'}
              style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
          )

    }}>
      <Tabs.Screen 
        name='index' 
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name='home' size={25} color={color} />
        }}
      />
      <Tabs.Screen 
        name='bills' 
        options={{
          title: 'Bills and Recharges',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name='file-document-outline' size={25} color={color} />
        }}
      />
      <Tabs.Screen 
        name='profile' 
        options={{
          title: 'profile',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name='account' size={25} color={color} />
        }}
      />
      <Tabs.Screen 
        name='activity' 
        options={{
          title: 'activity',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name='history' size={25} color={color}/>
        }}
      />
    </Tabs>
  );
}
