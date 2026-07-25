import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

export const TOKEN_KEY = 'informatech_token'

function normalizeApiUrl(value?: string) {
  const raw = value?.trim() || 'http://172.20.90.163:3000'
  const withProtocol = /^https?:\/\//i.test(raw)
    ? raw
    : `http://${raw}`

  return withProtocol.replace(/\/+$/, '')
}

export const API_URL = normalizeApiUrl(
  process.env.EXPO_PUBLIC_API_URL,
)

console.log('API_URL EM USO:', API_URL)

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
})

api.interceptors.request.use(async config => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})