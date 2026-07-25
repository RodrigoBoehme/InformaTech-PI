import { ActivityIndicator, Pressable, PressableProps, StyleSheet, Text } from 'react-native'
import { colors } from '@/constants/theme'
type Props = Omit<PressableProps,'style'> & { title:string; loading?:boolean; variant?:'primary'|'danger'|'outline'; style?: any }
export function Button({title,loading,variant='primary',style,...rest}:Props){
 const backgroundColor=variant==='danger'?colors.danger:variant==='outline'?'transparent':colors.primary
 return <Pressable disabled={loading||rest.disabled} style={({pressed})=>[styles.base,{backgroundColor,borderWidth:variant==='outline'?1:0,borderColor:colors.primary,opacity:pressed?0.8:1},style]} {...rest}>{loading?<ActivityIndicator color={variant==='outline'?colors.primary:'#fff'}/>:<Text style={[styles.text,{color:variant==='outline'?colors.primary:'#fff'}]}>{title}</Text>}</Pressable>
}
const styles=StyleSheet.create({base:{padding:14,borderRadius:12,alignItems:'center',justifyContent:'center'},text:{fontWeight:'700'}})
