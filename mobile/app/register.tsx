import { useState } from 'react'
import { Alert, Pressable, Text, View } from 'react-native'
import { router } from 'expo-router'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { PasswordInput } from '@/components/PasswordInput'
import { useAuth } from '@/contexts/AuthContext'
import { colors } from '@/constants/theme'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/

function formatPhone(value: string) {
  const numbers = value.replace(/\D/g, '').slice(0, 11)

  if (numbers.length <= 2) {
    return numbers
  }

  if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  }

  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
}

export default function Register() {
  const { signUp } = useAuth()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'REQUESTER',
    acceptedTerms: false, // Estado do checkbox de termos
  })

  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    const name = form.name.trim()
    const email = form.email.trim().toLowerCase()
    const phone = form.phone.trim()

    if (name.length < 3) {
      Alert.alert(
        'Nome inválido',
        'Digite seu nome com pelo menos 3 caracteres.'
      )
      return
    }

    if (!email.includes('@')) {
      Alert.alert(
        'E-mail inválido',
        'O e-mail precisa conter o símbolo @.'
      )
      return
    }

    if (!emailRegex.test(email)) {
      Alert.alert(
        'E-mail inválido',
        'Digite um e-mail no formato correto. Exemplo: nome@email.com'
      )
      return
    }

    if (!phoneRegex.test(phone)) {
      Alert.alert(
        'Telefone inválido',
        'Digite o telefone no formato (99) 99999-9999.'
      )
      return
    }

    if (form.password.length < 6) {
      Alert.alert(
        'Senha fraca',
        'A senha precisa ter pelo menos 6 caracteres.'
      )
      return
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert(
        'Senhas diferentes',
        'A senha e a confirmação de senha precisam ser iguais.'
      )
      return
    }

    // Validação do Checkbox
    if (!form.acceptedTerms) {
      Alert.alert(
        'Termos obrigatórios',
        'Você precisa aceitar os termos de uso e política de privacidade para continuar.'
      )
      return
    }

    try {
      setLoading(true)

      await signUp({
        name,
        email,
        phone: phone.replace(/\D/g, ''),
        password: form.password,
        role: form.role
      })

      router.replace('/home')
    } catch (error: any) {
      console.log('Erro recebido na tela:', {
        message: error?.message,
        code: error?.code,
        status: error?.response?.status,
        data: error?.response?.data,
        baseURL: error?.config?.baseURL,
        url: error?.config?.url
      })

      let message = 'Não foi possível realizar o cadastro.'

      if (error?.response?.status === 409) {
        message = 'Este e-mail já está cadastrado.'
      } else if (error?.response?.data?.message) {
        message = error.response.data.message
      } else if (error?.code === 'ECONNABORTED') {
        message = 'O servidor demorou muito para responder.'
      } else if (error?.message === 'Network Error') {
        message =
          'O celular não conseguiu acessar o backend. Verifique a rede, o IP e o firewall.'
      } else if (error?.message) {
        message = error.message
      }

      Alert.alert('Erro ao cadastrar', message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        gap: 12,
        backgroundColor: colors.background
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: '800',
          color: colors.secondary
        }}
      >
        Criar conta
      </Text>

      <Input
        placeholder="Nome"
        value={form.name}
        onChangeText={name =>
          setForm(previousForm => ({
            ...previousForm,
            name
          }))
        }
      />

      <Input
        placeholder="E-mail"
        autoCapitalize="none"
        keyboardType="email-address"
        value={form.email}
        onChangeText={email =>
          setForm(previousForm => ({
            ...previousForm,
            email
          }))
        }
      />

      <Input
        placeholder="Telefone"
        keyboardType="phone-pad"
        maxLength={15}
        value={form.phone}
        onChangeText={phone =>
          setForm(previousForm => ({
            ...previousForm,
            phone: formatPhone(phone)
          }))
        }
      />

      <PasswordInput
        placeholder="Senha"
        value={form.password}
        onChangeText={password =>
          setForm(previousForm => ({
            ...previousForm,
            password
          }))
        }
      />

      <PasswordInput
        placeholder="Confirmar senha"
        value={form.confirmPassword}
        onChangeText={confirmPassword =>
          setForm(previousForm => ({
            ...previousForm,
            confirmPassword
          }))
        }
      />

      <View
        style={{
          flexDirection: 'row',
          gap: 10
        }}
      >
        {['REQUESTER', 'VOLUNTEER'].map(role => {
          const selected = form.role === role

          return (
            <Pressable
              key={role}
              onPress={() =>
                setForm(previousForm => ({
                  ...previousForm,
                  role
                }))
              }
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: selected
                  ? colors.primary
                  : colors.border,
                backgroundColor: '#fff'
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '700',
                  color: selected
                    ? colors.primary
                    : colors.text
                }}
              >
                {role === 'REQUESTER'
                  ? 'Preciso de ajuda'
                  : 'Quero ajudar'}
              </Text>
            </Pressable>
          )
        })}
      </View>

      {/* Checkbox de Termos de Uso */}
      <Pressable
        onPress={() =>
          setForm(previousForm => ({
            ...previousForm,
            acceptedTerms: !previousForm.acceptedTerms
          }))
        }
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginTop: 6,
          marginBottom: 10,
          paddingVertical: 4
        }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: form.acceptedTerms ? colors.primary : colors.border,
            backgroundColor: form.acceptedTerms ? colors.primary : 'transparent',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {form.acceptedTerms && (
            <Text
              style={{
                color: '#fff',
                fontSize: 12,
                fontWeight: '900'
              }}
            >
              ✓
            </Text>
          )}
        </View>

        <Text
          style={{
            fontSize: 14,
            color:  '#fff',
            flexShrink: 1
          }}
        >
          Aceito os <Pressable onPress={()=>{router.push("/termos")}}><Text style={{color:"#fff",fontSize:12,flexShrink:1}}>Termos de Uso</Text></Pressable> e Política de Privacidade
        </Text>
      </Pressable>

      <Button
        title="Cadastrar"
        loading={loading}
        onPress={handleRegister}
      />

      <Button
        title="Voltar"
        variant="outline"
        onPress={() => router.back()}
      />
    </View>
  )
}