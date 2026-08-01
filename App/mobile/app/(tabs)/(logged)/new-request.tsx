import { useState } from 'react'
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import * as Location from 'expo-location'
import { router } from 'expo-router'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Screen } from '@/components/Screen'
import Background1 from '@/components/Background'

import { api } from '@/services/api'
import { colors } from '@/constants/theme'

export default function NewRequest() {
  const { width, height } = useWindowDimensions()

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Resgate',
    priority: 'HIGH',
    address: '',
    latitude: '',
    longitude: '',
  })
  const [loading, setLoading] = useState(false)

  // Captura localização atual do dispositivo
  async function locate() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        return Alert.alert('Localização', 'Permita o acesso à localização para usar este recurso.')
      }

      const l = await Location.getCurrentPositionAsync({})
      setForm((f) => ({
        ...f,
        latitude: String(l.coords.latitude),
        longitude: String(l.coords.longitude),
      }))
    } catch {
      Alert.alert('Erro', 'Não foi possível obter sua localização atual.')
    }
  }

  // Envio do formulário
  async function save() {
    if (!form.title || !form.description || !form.latitude) {
      return Alert.alert(
        'Campos obrigatórios',
        'Por favor, preencha pelo menos o título, a descrição e a localização.'
      )
    }

    try {
      setLoading(true)
      await api.post('/pedidos', form)
      router.replace('/home')
    } catch (e: any) {
      Alert.alert(
        'Erro',
        e?.response?.data?.message || 'Não foi possível salvar o pedido.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen headr={{ title: 'Novo ', title2ndPart: 'Pedido' }}>
      <Background1 width={width} height={height} />

      <ScrollView
        contentContainerStyle={s.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.subtitle}>
          Descreva claramente a necessidade para facilitar o atendimento.
        </Text>

        {/* Card do Formulário */}
        <View style={s.card}>
          <View style={s.fieldGroup}>
            <Text style={s.label}>INFORMAÇÕES PRINCIPAIS</Text>
            <Input
              placeholder="Título do pedido"
              value={form.title}
              onChangeText={(title) => setForm({ ...form, title })}
            />
            <Input
              placeholder="Descrição detalhada"
              multiline
              numberOfLines={3}
              value={form.description}
              onChangeText={(description) => setForm({ ...form, description })}
            />
          </View>

          <View style={s.fieldGroup}>
            <Text style={s.label}>CATEGORIA E PRIORIDADE</Text>
            <Input
              placeholder="Categoria (ex: Resgate, Alimentos)"
              value={form.category}
              onChangeText={(category) => setForm({ ...form, category })}
            />
            <Input
              placeholder="Prioridade (LOW, MEDIUM, HIGH, CRITICAL)"
              value={form.priority}
              onChangeText={(priority) => setForm({ ...form, priority })}
            />
          </View>

          <View style={s.fieldGroup}>
            <Text style={s.label}>LOCALIZAÇÃO</Text>
            <Input
              placeholder="Endereço ou Ponto de referência"
              value={form.address}
              onChangeText={(address) => setForm({ ...form, address })}
            />

            <Button
              title="Usar minha localização atual"
              variant="outline"
              onPress={locate}
            />

            <View style={s.row}>
              <View style={s.flex1}>
                <Input
                  placeholder="Latitude"
                  keyboardType="numeric"
                  value={form.latitude}
                  onChangeText={(latitude) => setForm({ ...form, latitude })}
                />
              </View>
              <View style={s.flex1}>
                <Input
                  placeholder="Longitude"
                  keyboardType="numeric"
                  value={form.longitude}
                  onChangeText={(longitude) => setForm({ ...form, longitude })}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Botão de Envio */}
        <View style={s.actionContainer}>
          <Button title="Salvar pedido" onPress={save} />
          <Text style={s.footerNote}>
            A localização é usada apenas para apresentar o pedido no mapa.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  )
}

const s = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  subtitle: {
    color: '#C8D5E3',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    gap: 20,
  },
  fieldGroup: {
    gap: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9FB1C4',
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  flex1: {
    flex: 1,
  },
  actionContainer: {
    gap: 12,
    marginTop: 8,
  },
  footerNote: {
    color: colors.muted || '#9FB1C4',
    textAlign: 'center',
    fontSize: 12,
  },
})