import { ReactNode } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '@/constants/theme'
export function Screen({children,scroll=true,style}:{children:ReactNode;scroll?:boolean;style?:ViewStyle}){ return <SafeAreaView style={styles.safe}>{scroll?<ScrollView contentContainerStyle={[styles.content,style]} keyboardShouldPersistTaps="handled">{children}</ScrollView>:<SafeAreaView style={[styles.content,{flex:1},style]}>{children}</SafeAreaView>}</SafeAreaView> }
const styles=StyleSheet.create({safe:{flex:1,backgroundColor:colors.background},content:{padding:20,gap:14}})
