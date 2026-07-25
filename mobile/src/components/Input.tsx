import { TextInput, TextInputProps } from 'react-native'
import { colors } from '@/constants/theme'

export function Input(props: TextInputProps) {
  return <TextInput placeholderTextColor={colors.muted} style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, fontSize: 16 }} {...props} />
}