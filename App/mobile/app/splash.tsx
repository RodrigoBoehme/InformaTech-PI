import { useEffect } from 'react'
import { Image, Text, View } from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '@/contexts/AuthContext'
import { colors } from '@/constants/theme'

export default function SplashScreen(){
 const {user,loading}=useAuth()
 useEffect(()=>{ if(!loading){ const timer=setTimeout(()=>router.replace(user?'/home':'/login'),1600); return()=>clearTimeout(timer)} },[loading,user])
 return <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:colors.background,gap:18}}>
  <Image source={require('../assets/splash.png')} style={{width:220,height:220,resizeMode:'contain'}}/>
  <Text style={{color:'#fff',fontSize:28,fontWeight:'900'}}>Informa<Text style={{color:colors.primary}}>Tech</Text></Text>
  <Text style={{color:colors.muted}}>Informação e apoio em situações de risco</Text>
 </View>
}
