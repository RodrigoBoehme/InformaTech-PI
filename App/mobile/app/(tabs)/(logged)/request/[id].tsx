import { useCallback, useState } from 'react'
import { Alert, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'

import { Header } from '@/components/Header'
import { Screen } from '@/components/Screen'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import Background1 from '@/components/Background'

import { api } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'
import { Pedido } from '@/types'
import { colors } from '@/constants/theme'

export default function RequestDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { user } = useAuth()
  const { width, height } = useWindowDimensions()

  const [item, setItem] = useState<Pedido | null>(null)
  const [message, setMessage] = useState('Posso ajudar com este pedido.')

  const load = useCallback(() => {
    api
      .get(`/pedidos/${id}`)
      .then((r) => setItem(r.data))
      .catch(() => Alert.alert('Erro', 'Pedido não encontrado.'))
  }, [id])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load])
  )

  async function offer() {
    try {
      await api.post('/ajudas', { requestId: id, message })
      Alert.alert('Ajuda oferecida', 'Sua oferta foi registrada com sucesso.')
    } catch {
      Alert.alert('Erro', 'Não foi possível enviar a oferta de ajuda.')
    }
  }

  async function remove() {
    try {
      await api.delete(`/pedidos/${id}`)
      router.navigate('/')
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir o pedido.')
    }
  }

  if (!item) {
    return (
      <Screen headr={{}}>
        <Header title="Pedido" />
        <View style={s.centerContainer}>
          <Text style={s.loadingText}>Carregando informações...</Text>
        </View>
      </Screen>
    )
  }

  const isVolunteer = user?.role === 'VOLUNTEER' && item.status === 'OPEN'
  const canDelete = user?.id === item.requesterId || user?.role === 'ADMIN'

  return (
    <Screen headr={{ title: 'Detalhes', title2ndPart: ' do pedido' }}>
      <Background1 height={height} width={width} />

      <View style={s.container}>
        {/* Card Principal de Informações */}
        <View style={s.card}>
          <View style={s.badgeRow}>
            <View style={s.categoryBadge}>
              <Text style={s.categoryText}>{item.category}</Text>
            </View>
            <View style={s.statusBadge}>
              <Text style={s.statusText}>{item.status}</Text>
            </View>
          </View>

          <Text style={s.title}>{item.title}</Text>

          <View style={s.divider} />

          <View style={s.section}>
            <Text style={s.label}>DESCRIÇÃO</Text>
            <Text style={s.body}>{item.description}</Text>
          </View>

          {item.address && (
            <View style={s.section}>
              <Text style={s.label}>LOCALIZAÇÃO</Text>
              <Text style={s.body}>{item.address}</Text>
            </View>
          )}
        </View>

        {/* Área de Ação do Voluntário */}
        {isVolunteer && (
          <View style={s.actionCard}>
            <Text style={s.sectionTitle}>Oferecer Ajuda</Text>
            <Input
              value={message}
              onChangeText={setMessage}
              multiline
              placeholder="Escreva uma mensagem..."
            />
            <Button title="Oferecer ajuda" onPress={offer} />
          </View>
        )}

        {/* Botão de Exclusão (Autor/Admin) */}
        {canDelete && (
          <View style={s.deleteContainer}>
            <Button
              title="Excluir pedido"
              variant="danger"
              onPress={() =>
                Alert.alert('Excluir pedido', 'Confirma a exclusão deste pedido?', [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Excluir', style: 'destructive', onPress: remove },
                ])
              }
            />
          </View>
        )}
      </View>
    </Screen>
  )
}

const s = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    gap: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusBadge: {
    backgroundColor: '#9FB1C4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.card,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 2,
  },
  section: {
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9FB1C4',
    letterSpacing: 0.8,
  },
  body: {
    color: colors.card,
    fontSize: 15,
    lineHeight: 22,
  },
  actionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
  },
  deleteContainer: {
    marginTop: 8,
  },
})