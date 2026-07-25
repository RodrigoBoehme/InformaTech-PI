import { useState } from 'react'
import { Pressable, TextInput, TextInputProps, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/constants/theme'

/** Campo de senha com botão de olho para mostrar ou ocultar o conteúdo. */
export function PasswordInput(props: TextInputProps) {
  const [visible, setVisible] = useState(false)
  return <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',borderWidth:1,borderColor:colors.border,borderRadius:12}}>
    <TextInput {...props} secureTextEntry={!visible} placeholderTextColor={colors.muted} style={{flex:1,padding:14,fontSize:16}} />
    <Pressable onPress={()=>setVisible(v=>!v)} accessibilityLabel={visible?'Ocultar senha':'Mostrar senha'} style={{padding:14}}>
      <Ionicons name={visible?'eye-off-outline':'eye-outline'} size={22} color={colors.muted}/>
    </Pressable>
  </View>
}
