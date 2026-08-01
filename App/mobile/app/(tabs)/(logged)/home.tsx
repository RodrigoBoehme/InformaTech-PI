import { useCallback, useState } from 'react'
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { Button } from '@/components/Button'
import { Screen } from '@/components/Screen'
import Background1 from '@/components/Background'

import { api } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'
import { Pedido } from '@/types'
import { colors } from '@/constants/theme'

const labels: Record<string, string> = {
  OPEN: 'Aberto',
  IN_PROGRESS: 'Em atendimento',
  RESOLVED: 'Concluído',
  CANCELED: 'Cancelado',
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
}

export default function Home() {
  const { width, height } = useWindowDimensions()
  const { user } = useAuth()

  const [items, setItems] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get('/pedidos')
      setItems(response.data)
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os pedidos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load])
  )

  async function aceitar(id: string) {
    try {
      await api.patch(`/pedidos/${id}/aceitar`)
      Alert.alert('Sucesso', 'Atendimento aceito com sucesso!')
      load()
    } catch {
      Alert.alert('Erro', 'Não foi possível aceitar o atendimento.')
    }
  }

  return (
    <Screen headr={{ title: 'Informa', title2ndPart: 'Tech' }} scroll={false}>
      <Background1 width={width} height={height} />

      <View style={s.container}>
        {/* Mensagem de Boas-Vindas */}
        <Text style={s.welcome}>
          Olá, <Text style={s.username}>{user?.name || 'Usuário'}</Text>. Como podemos ajudar?
        </Text>

        {/* Botões de Ação Rápida */}
        <View style={s.actionsContainer}>
          <Pressable
            style={s.actionButton}
            onPress={() => router.replace('/centralDeApoio')}
          >
            <View style={s.iconBadge}>
              <Ionicons name="alert-circle" size={24} color={colors.primary} />
            </View>
            <Text style={s.actionText}>Central de Apoio</Text>
          </Pressable>

          <Pressable
            style={s.actionButton}
            onPress={() => router.replace('/new-request')}
          >
            <View style={s.iconBadge}>
              <Ionicons name="add" size={26} color={colors.primary} />
            </View>
            <Text style={s.actionText}>Novo Pedido</Text>
          </Pressable>
        </View>

        {/* Lista de Pedidos */}
        <Text style={s.sectionTitle}>Pedidos recentes</Text>

        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          refreshing={loading}
          onRefresh={load}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.listContent}
          ListEmptyComponent={
            !loading ? (
              <View style={s.emptyContainer}>
                <Text style={s.emptyText}>Nenhum pedido encontrado.</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            const isOpen = item.status === 'OPEN'
            const isVolunteer = user?.role === 'VOLUNTEER'

            return (
              <Pressable
                style={s.card}
                onPress={() =>
                  router.push({
                    pathname: '/request/[id]',
                    params: { id: item.id },
                  })
                }
              >
                {/* Header do Card */}
                <View style={s.cardHeader}>
                  <Text style={s.cardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View style={s.statusBadge}>
                    <Text style={s.statusText}>
                      {labels[item.status] || item.status}
                    </Text>
                  </View>
                </View>

                {/* Subtítulo / Meta */}
                <Text style={s.metaText}>
                  {item.category} • Prioridade:{' '}
                  <Text style={s.priorityHighlight}>
                    {labels[item.priority] || item.priority}
                  </Text>
                </Text>

                {/* Descrição */}
                <Text numberOfLines={2} style={s.description}>
                  {item.description}
                </Text>

                {/* Ação rápida para Voluntários */}
                {isOpen && isVolunteer && (
                  <View style={s.cardAction}>
                    <Button
                      title="Aceitar atendimento"
                      onPress={() => aceitar(item.id)}
                    />
                  </View>
                )}
              </Pressable>
            )
          }}
        />
      </View>
    </Screen>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 16,
  },
  welcome: {
    color: '#C8D5E3',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 4,
  },
  username: {
    fontWeight: '700',
    color: '#FFF',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 12,
  },
  actionText: {
    color: colors.card || '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.card || '#FFF',
    marginTop: 8,
  },
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.card || '#FFF',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9FB1C4',
    textTransform: 'uppercase',
  },
  metaText: {
    fontSize: 13,
    color: '#9FB1C4',
  },
  priorityHighlight: {
    fontWeight: '700',
    color: '#FFF',
  },
  description: {
    fontSize: 14,
    color: '#C8D5E3',
    lineHeight: 20,
  },
  cardAction: {
    marginTop: 8,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9FB1C4',
    fontSize: 14,
  },
})