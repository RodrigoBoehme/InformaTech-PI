import * as SecureStore from 'expo-secure-store'
import axios from 'axios'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import { api, TOKEN_KEY } from '@/services/api'
import { Usuario } from '@/types'

type Cadastro = {
  name: string
  email: string
  phone: string
  password: string
  role: string
}

type AuthContextData = {
  user: Usuario | null
  loading: boolean
  signIn(email: string, password: string): Promise<void>
  signUp(data: Cadastro): Promise<void>
  signOut(): Promise<void>
  refreshUser(): Promise<void>
}

const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  async function refreshUser() {
    try {
      const { data } = await api.get('/autenticacao/perfil')
      setUser(data)
    } catch (error) {
      await SecureStore.deleteItemAsync(TOKEN_KEY)
      setUser(null)
      throw error
    }
  }

  useEffect(() => {
    async function restoreSession() {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY)

        if (token) {
          await refreshUser()
        }
      } catch (error) {
        console.log('Erro ao restaurar sessão:', error)

        await SecureStore.deleteItemAsync(TOKEN_KEY)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    void restoreSession()
  }, [])

  async function signIn(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase()

    console.log('Iniciando login:', {
      email: normalizedEmail,
    })

    try {
      const { data } = await api.post('/autenticacao/entrar', {
        email: normalizedEmail,
        password,
      })

      if (!data?.token) {
        throw new Error('O backend não retornou o token de autenticação.')
      }

      await SecureStore.setItemAsync(TOKEN_KEY, data.token)
      setUser(data.user)

      console.log('Login realizado com sucesso.')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Erro no login:', {
          message: error.message,
          code: error.code,
          baseURL: error.config?.baseURL,
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
        })
      } else {
        console.log('Erro inesperado no login:', error)
      }

      throw error
    }
  }

  async function signUp(payload: Cadastro) {
    const normalizedPayload = {
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim(),
      password: payload.password,
      role: payload.role,
    }

    console.log('Iniciando cadastro:', {
      ...normalizedPayload,
      password: '******',
    })

    try {
      const statusResponse = await api.get('/status')

      console.log('Backend acessível:', statusResponse.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Erro ao testar o backend:', {
          message: error.message,
          code: error.code,
          baseURL: error.config?.baseURL,
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
        })
      } else {
        console.log('Erro inesperado ao testar backend:', error)
      }

      throw new Error(
        'Não foi possível acessar o backend. Verifique o IP, a porta e se o servidor está rodando.',
      )
    }

    try {
      const cadastroResponse = await api.post(
        '/autenticacao/cadastro',
        normalizedPayload,
      )

      console.log(
        'Cadastro realizado com sucesso:',
        cadastroResponse.data,
      )
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Erro no cadastro:', {
          message: error.message,
          code: error.code,
          baseURL: error.config?.baseURL,
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
        })
      } else {
        console.log('Erro inesperado no cadastro:', error)
      }

      throw error
    }

    try {
      await signIn(
        normalizedPayload.email,
        normalizedPayload.password,
      )

      console.log('Login automático concluído.')
    } catch (error) {
      console.log(
        'Cadastro realizado, mas o login automático falhou:',
        error,
      )

      throw error
    }
  }

  async function signOut() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY)
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}