import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { AuthProvider } from '@/contexts/AuthContext'
import {Tabs} from 'expo-router'
import { Ionicons } from "@expo/vector-icons";
import { colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext'

export default function TabLayout() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  if(isAdmin)return(
    // 
    <AuthProvider>

    <Tabs
    screenOptions={{
      headerShown: false,

      tabBarStyle: {
        backgroundColor: "#6a2e2e00",
        borderTopWidth: 0,
        height: 100,
        opacity:50,
      
      },

      tabBarActiveTintColor: colors.primary,

      tabBarInactiveTintColor: "#777",
      
    }}
    >
      <Tabs.Screen
      name='home'
      options={{
        title:'HomeScreen',
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name="home"
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
      options={{
        title:"usuarios",
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name="people"
            size={size}
            color={color}
          />
        ),
      }}
      />
<Tabs.Screen
 name='request/[id]'
 options={{href:null}}
/>
<Tabs.Screen
name='helps'
options={{
  title:"Ajudar",
  tabBarIcon: ({ color, size }) => (
          <Ionicons
            name="medkit"
            size={size}
            color={color}
          />
        ),
}}
/>

<Tabs.Screen
name='profile'
options={{
  title:"Perfil",
  tabBarIcon: ({ color, size }) => (
          <Ionicons
            name="person"
            size={size}
            color={color}
          />
        ),
}}
/>

    </Tabs>
    </AuthProvider>
  )
  else{return(
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
        title:'HomeScreen',
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name="home"
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
<Tabs.Screen
name='helps'
options={{
  title:"Ajudar",
  tabBarIcon: ({ color, size }) => (
          <Ionicons
            name="medkit"
            size={size}
            color={color}
          />
        ),
}}
/>

<Tabs.Screen
name='profile'
options={{
  title:"Perfil",
  tabBarIcon: ({ color, size }) => (
          <Ionicons
            name="person"
            size={size}
            color={color}
          />
        ),
}}
/>

    </Tabs>
    </AuthProvider>
  )
  }
}
