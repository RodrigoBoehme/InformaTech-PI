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
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
    
  )
}
