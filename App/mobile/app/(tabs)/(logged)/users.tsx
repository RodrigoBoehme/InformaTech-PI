import { useCallback, useState } from 'react'
import { Alert, FlatList, StyleSheet, Text, View, RefreshControl ,useWindowDimensions} from 'react-native'
import { useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { Header } from '@/components/Header'
import { Screen } from '@/components/Screen'
import { Button } from '@/components/Button'
import { api } from '@/services/api'
import { Usuario } from '@/types'
import { colors } from '@/constants/theme'
import Background1 from '@/components/Background'

export default function Users() {
  const [items, setItems] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const {width,height}=useWindowDimensions()

  // Mapeamento de perfis para exibição amigável
  const roleLabels: Record<string, string> = {
    ADMIN: 'Administrador',
    VOLUNTEER: 'Voluntário',
    USER: 'Solicitante',
  }

  const load = useCallback(async () => {
    try {
      const response = await api.get('/usuarios')
      setItems(response.data)
    } catch (error) {
      Alert.alert('Erro', 'Acesso exclusivo para administradores ou falha na requisição.')
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

  async function toggleStatus(item: Usuario) {
    try {
      await api.put(`/usuarios/${item.id}`, { active: !item.active })
      load()
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível alterar o status do usuário.')
    }
  }

  async function remove(id: string) {
    Alert.alert(
      'Excluir usuário',
      'Esta ação é permanente e pode remover dados relacionados.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/usuarios/${id}`)
              load()
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o usuário.')
            }
          },
        },
      ]
    )
  }

  return (
    <Screen scroll={false}>

      
      {/* Cabeçalho */}
      <Header title="Usuários" title2ndPart='' />

      <Background1 width={width} height={height}/>
      {/* Lista de Usuários */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFF" />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={s.emptyContainer}>
              <Ionicons name="people-outline" size={48} color={colors.muted || '#64748B'} />
              <Text style={s.emptyText}>Nenhum usuário encontrado.</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            {/* Topo do Card: Nome + Badge de Status */}
            <View style={s.cardHeader}>
              <View style={s.userInfo}>
                <Text style={s.title}>{item.name}</Text>
                <Text style={s.roleText}>{roleLabels[item.role] || item.role}</Text>
              </View>

              <View
                style={[
                  s.statusBadge,
                  { backgroundColor: item.active ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)' },
                ]}
              >
                <View
                  style={[
                    s.statusDot,
                    { backgroundColor: item.active ? '#22C55E' : '#EF4444' },
                  ]}
                />
                <Text style={[s.statusText, { color: item.active ? '#22C55E' : '#EF4444' }]}>
                  {item.active ? 'Ativo' : 'Inativo'}
                </Text>
              </View>
            </View>

            {/* Informações de Contato */}
            <View style={s.detailsContainer}>
              <View style={s.detailRow}>
                <Ionicons name="mail-outline" size={14} color={colors.muted || '#94A3B8'} />
                <Text style={s.metaText}>{item.email}</Text>
              </View>
              {item.phone ? (
                <View style={s.detailRow}>
                  <Ionicons name="call-outline" size={14} color={colors.muted || '#94A3B8'} />
                  <Text style={s.metaText}>{item.phone}</Text>
                </View>
              ) : null}
            </View>

            {/* Botões de Ação */}
            <View style={s.actionsContainer}>
              <Button
                style={s.actionButton}
                title={item.active ? 'Desativar' : 'Ativar'}
                variant="outline"
                onPress={() => toggleStatus(item)}
              />
              <Button
                style={s.actionButton}
                title="Excluir"
                variant="danger"
                onPress={() => remove(item.id)}
              />
            </View>
          </View>
        )}
      />
    </Screen>
  )
}

const s = StyleSheet.create({
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: colors.card || '#0F172A',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text || '#FFFFFF',
  },
  roleText: {
    fontSize: 13,
    color: '#3B82F6',
    fontWeight: '600',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    gap: 6,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    color: colors.muted || '#94A3B8',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
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