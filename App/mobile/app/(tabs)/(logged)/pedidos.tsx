import { Screen } from "@/components/Screen"
import { useCallback, useState } from 'react'
import Background1 from '@/components/Background'
import { Alert, FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View, } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { colors } from "@/constants/theme"
import { Button } from '@/components/Button'
import { api } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'
import { Pedido } from '@/types'
import { Dropdown } from "react-native-element-dropdown"


const data=[
  {label:"",value:""},
  {label:"Baixa",value:"LOW"},
  {label:"Media",value:"MEDIUM"},
  {label:"Alta",value:"HIGH"},
  {label:"Critica",value:"CRITICAL"}
]
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

export default function Pedidos() {
  const { height, width } = useWindowDimensions()
  const { user } = useAuth()

  const [params,setParams]=useState("")
  const [items, setItems] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(false)
  const [value,setValue]=useState("HIGH")

  const load = useCallback(async () => {
    setLoading(true)
      try {
        const response = await api.get('/pedidos'+`?p=${value}`)
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
  async function reload(){
    setTimeout(()=>load,100)
  }

  return (
    <Screen headr={{ title: "Ped", title2ndPart: "idos" }} scroll={false}>
      <Background1 width={width} height={height} />
          <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                iconStyle={styles.iconStyle}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Selecione uma Categoria"
                value={value}
                onChange={item => {
                  setValue(item.value)
                  router.replace("/pedidos")
                }}
            />

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




  const styles = StyleSheet.create({
    dropdown: {
      margin: 0,
      height: 50,
      color:"#fff",
      borderBottomColor: 'gray',
      borderBottomWidth: 0.5,
      backgroundColor:"#ffffff00",
      flex:0,
      padding:15,
      borderRadius:10
    },
    icon: {
      marginRight: 5,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
      color:"#fff",
      
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
  });