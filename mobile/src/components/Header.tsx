import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { colors } from '@/constants/theme'
export function Header({title,back=false,action}:{title:string;back?:boolean;action?:React.ReactNode}){return <View style={s.row}>{back?<Pressable onPress={()=>router.back()}><Ionicons name="arrow-back" size={24} color={colors.card}/></Pressable>:<View style={{width:24}}/>}<Text style={s.title}>{title}</Text>{action||<View style={{width:24}}/>}</View>}
const s=StyleSheet.create({row:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},title:{fontSize:24,fontWeight:'800',color:colors.card,marginTop:65}})
