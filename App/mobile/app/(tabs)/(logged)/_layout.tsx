import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { AuthProvider } from '@/contexts/AuthContext'
import {Tabs} from 'expo-router'
import { Ionicons } from "@expo/vector-icons";
import { colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    // 
    <AuthProvider>

    <Tabs
    screenOptions={{
      headerShown: false,

      tabBarStyle: {
        backgroundColor: "#6a2e2e00",
        borderTopWidth: 0,
        height: 80,
      },

      tabBarActiveTintColor: colors.primary,

      tabBarInactiveTintColor: "#777",
    }}
    >
      <Tabs.Screen
      name='home'
      options={{
        title:'HomSCreen',
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name="map"
            size={size}
            color={color}
          />
        ),
        
      }}
      />
      <Tabs.Screen
      name='map'
      options={{
        title:"Mapa",
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name="map"
            size={size}
            color={color}
          />
        ),
      }}
      />
      
  <Tabs.Screen
      name='new-request'
      options={{href:null}}
      />

<Tabs.Screen
      name='users'
      options={{href:null}}
      />
<Tabs.Screen
 name='request/[id]'
 options={{href:null}}
/>

    </Tabs>
    </AuthProvider>
  )
}
