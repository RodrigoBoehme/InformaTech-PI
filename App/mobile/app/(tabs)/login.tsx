import { useState } from 'react'
import { Alert, Text, View, useWindowDimensions } from 'react-native'
import { Link, router } from 'expo-router'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { PasswordInput } from '@/components/PasswordInput'
import { useAuth } from '@/contexts/AuthContext'
import { colors } from '@/constants/theme'
import { StyleSheet } from 'react-native'


export default function Login() {
  const {width,height}=useWindowDimensions()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    const normalizedEmail=email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) { Alert.alert('E-mail inválido','Digite um e-mail válido, como nome@email.com.'); return }
    if (password.length < 6) { Alert.alert('Senha inválida','A senha precisa ter pelo menos 6 caracteres.'); return }
    try {
      setLoading(true)
      await signIn(normalizedEmail, password)
      router.replace('/home')
    } catch {
      Alert.alert('Erro', 'Não foi possível entrar. Verifique e-mail e senha.')
    } finally {
      setLoading(false)
    }
  }

  return (

    
      <View style={[{ flex: 1, padding: 24, justifyContent: 'center', gap: 14, backgroundColor: colors.background ,  },
      {width:width,
        height:height

      
      }]}>
        
      <View style={[styles.glowTop, { top: -height * 0.4, right: -width * 0.8, width: width * 1.4, height: width * 1.3, borderRadius: (width * 1) / 2 }]} />
      <View style={[styles.glowBottom, { bottom: -height * 0.4, left: -width * 0.8, width: width * 1.4, height: width * 1.2, borderRadius: (width * 1) / 2 }]} />
      <View style={[styles.glowBottom, { top: -height * 0.4, left: -width * 0.9, width: width * 1.44, height: width * 1.1, borderRadius: (width * 1) / 2 }]} />



      <Text style={{ fontSize: 32, fontWeight: '800', color: colors.card }}>Informa<Text style={{color:colors.primary}}>Tech</Text></Text>
      <Text style={{ fontSize: 16, color: colors.muted, marginBottom: 16 }}>Rede solidária para emergências e calamidades.</Text>
      <Input placeholder="E-mail" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <PasswordInput placeholder="Senha" value={password} onChangeText={setPassword} />
      <Button title="Entrar" loading={loading} onPress={handleLogin} />
      <Link href="/register" style={{ color: colors.primary, textAlign: 'center', fontWeight: '700' }}>Criar minha conta</Link>
    </View>

    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712", 
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24, // Ajustado conforme base da sugestão
    paddingVertical: 20,
  },
  glowTop: {
    position: "absolute",
    backgroundColor: "rgba(132, 204, 22, 0.12)", 
  },
  glowBottom: {
    position: "absolute",
    backgroundColor: "rgba(30, 41, 59, 0.5)", 
  },
  mainContent: {
    flex: 1,
    width: "100%",
    maxWidth: 500, // Expandido para tablets (Sugestão 8)
    justifyContent: "center",
  },
  brandContainer: {
    alignItems: "center",
  },
  logoWrapper: {
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    marginBottom: 32,
  },
  logo: {},
  title: {
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1.5,
    marginBottom: 16,
    textAlign: "center",
  },
  titleAccent: {
    color: "#35e6c6", 
  },
  subtitle: {
    color: "#9CA3AF", 
    textAlign: "center",
    maxWidth: 340, // Limitado para não quebrar feio (Sugestão 5)
    paddingHorizontal: 12,
  },
  actionGroup: {
    width: "100%",
    gap: 16,
  },
  btnPrimaryContainer: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  btnGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnPrimaryText: {
    color: "#061500",
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  btnSecondary: {
    width: "100%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  btnSecondaryText: {
    color: "#E5E7EB",
    fontWeight: "600",
  },
  btnPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.85,
  },
  footerContainer: {
    alignItems: "center",
    width: "100%",
    gap: 16,
    marginTop: 10,
  },
  footerLine: {
    width: 40,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 1,
  },
  footerText: {
    color: "#4B5563",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});