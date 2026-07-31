import { useCallback, useState } from 'react'
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View,useWindowDimensions } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { Header } from '@/components/Header'
import { Screen } from '@/components/Screen'
import { Button } from '@/components/Button'
import { api } from '@/services/api'
import { Ajuda } from '@/types'
import { colors } from '@/constants/theme'
import Background1 from '@/components/Background'

const statusLabels: Record<string, string> = {
  OFFERED: 'Oferecida',
  ACCEPTED: 'Aceita',
  COMPLETED: 'Concluída',
  CANCELED: 'Cancelada',
}

const statusColors: Record<string, string> = {
  OFFERED: '#3B82F6',   // Azul
  ACCEPTED: '#F59E0B',  // Amarelo
  COMPLETED: '#10B981', // Verde
  CANCELED: '#EF4444',  // Vermelho
}

export default function Helps() {
  const [items, setItems] = useState<Ajuda[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const {width,height}=useWindowDimensions()

  const load = useCallback(async () => {
    try {
      const response = await api.get('/ajudas')
      setItems(response.data)
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar as ajudas.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load])
  )

  const onRefresh = () => {
    setRefreshing(true)
    load()
  }

  async function finish(id: string) {
    try {
      await api.put(`/ajudas/${id}`, { status: 'COMPLETED' })
      load()
    } catch {
      Alert.alert('Erro', 'Não foi possível concluir esta ajuda.')
    }
  }

  return (
    <Screen scroll={false}>
      <Background1 width={width} height={height} />

      {/* Header com o botão de voltar padrão */}
      <Header title="Ofertas d" title2ndPart='e Ajuda'  />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFF" />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={s.emptyContainer}>
              <Ionicons name="hand-left-outline" size={48} color={colors.muted || '#64748B'} />
              <Text style={s.emptyText}>Nenhuma oferta de ajuda registrada.</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            {/* Header do Card: Nome do Voluntário + Badge de Status */}
            <View style={s.cardHeader}>
              <View style={s.volunteerInfo}>
                <View style={s.avatarBg}>
                  <Ionicons name="person" size={16} color="#3B82F6" />
                </View>
                <Text style={s.title}>{item.volunteer?.name || 'Voluntário'}</Text>
              </View>

              <View
                style={[
                  s.statusBadge,
                  { backgroundColor: `${statusColors[item.status] || '#3B82F6'}20` },
                ]}
              >
                <Text
                  style={[
                    s.statusText,
                    { color: statusColors[item.status] || '#3B82F6' },
                  ]}
                >
                  {statusLabels[item.status] || item.status}
                </Text>
              </View>
            </View>

            {/* Mensagem da Ajuda */}
            <View style={s.messageContainer}>
              <Text style={s.messageText}>{item.message}</Text>
            </View>

            {/* Ação de Conclusão */}
            {item.status !== 'COMPLETED' && (
              <View style={s.actionContainer}>
                <Button
                  title="Marcar como concluída"
                  variant="outline"
                  onPress={() => finish(item.id)}
                />
              </View>
            )}
          </View>
        )}
      />
    </Screen>
  )
}

const s = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: colors.card || '#0F172A',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  volunteerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  avatarBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text || '#FFFFFF',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  messageText: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
  },
  actionContainer: {
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    color: colors.muted || '#94A3B8',
    fontSize: 15,
  },
})