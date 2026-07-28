import { useCallback, useState } from 'react'
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { api } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'
import { Pedido } from '@/types'
import { colors } from '@/constants/theme'
import { Button } from '@/components/Button'
import { Header } from '@/components/Header'
import { Screen } from '@/components/Screen'
const labels={OPEN:'Aberto',IN_PROGRESS:'Em atendimento',RESOLVED:'Concluído',CANCELED:'Cancelado',LOW:'Baixa',MEDIUM:'Média',HIGH:'Alta',CRITICAL:'Crítica'} as Record<string,string>
export default function Home(){
 const {user,signOut}=useAuth(); const [items,setItems]=useState<Pedido[]>([]); const [loading,setLoading]=useState(false)
 const load=useCallback(async()=>{setLoading(true);try{setItems((await api.get('/pedidos')).data)}catch{Alert.alert('Erro','Não foi possível carregar os pedidos.')}finally{setLoading(false)}},[])
 useFocusEffect(useCallback(()=>{load()},[load]))
 async function sair(){await signOut();router.replace('/login')}
 async function aceitar(id:string){await api.patch(`/pedidos/${id}/aceitar`);load()}
 return <Screen scroll={false}>
  <Header title="InformaTech" action={<Pressable onPress={sair}><Ionicons name="log-out-outline" size={25} color={colors.card}/></Pressable>}/>
  <Text style={s.welcome}>Olá, {user?.name}. Como podemos ajudar?</Text>
  <View style={s.actions}>
   <Pressable style={s.action} onPress={()=>router.push('/new-request')}><Ionicons name="alert-circle" size={25} color={colors.primary}/><Text style={s.actionText}>Novo pedido</Text></Pressable>
   <Pressable style={s.action} onPress={()=>router.push('/map')}><Ionicons name="map" size={25} color={colors.primary}/><Text style={s.actionText}>Mapa</Text></Pressable>
   <Pressable style={s.action} onPress={()=>router.push('/helps')}><Ionicons name="hand-left" size={25} color={colors.primary}/><Text style={s.actionText}>Ajudas</Text></Pressable>
   <Pressable style={s.action} onPress={()=>router.push('/profile')}><Ionicons name="person" size={25} color={colors.primary}/><Text style={s.actionText}>Perfil</Text></Pressable>
  </View>
  {user?.role==='ADMIN'&&<><Button title="Gerenciar usuários" onPress={()=>router.push('/users')}/><Text style={{color:'#C8D5E3'}}>No mapa, o administrador pode cadastrar e editar zonas de risco e níveis de inundação.</Text></>} 
  <Text style={s.section}>Pedidos recentes</Text>
  <FlatList refreshing={loading} onRefresh={load} data={items} keyExtractor={i=>i.id} contentContainerStyle={{gap:12,paddingBottom:30}} renderItem={({item})=><Pressable onPress={()=>router.push({pathname:'/request/[id]',params:{id:item.id}})} style={s.card}>
   <View style={s.between}><Text style={s.cardTitle}>{item.title}</Text><Text style={s.badge}>{labels[item.status]}</Text></View>
   <Text style={s.meta}>{item.category} • Prioridade {labels[item.priority]}</Text><Text numberOfLines={2} style={s.description}>{item.description}</Text>
   {item.status==='OPEN'&&user?.role==='VOLUNTEER'?<Button title="Aceitar atendimento" onPress={()=>aceitar(item.id)}/>:null}
  </Pressable>}/>
 </Screen>
}
const s=StyleSheet.create({welcome:{color:'#C8D5E3',fontSize:16},actions:{flexDirection:'row',flexWrap:'wrap',gap:10},action:{width:'48%',backgroundColor:colors.surface,padding:16,borderRadius:16,gap:8},actionText:{color:colors.card,fontWeight:'700'},section:{fontSize:20,fontWeight:'800',color:colors.card,marginTop:4},card:{backgroundColor:colors.card,padding:16,borderRadius:16,gap:8},between:{flexDirection:'row',justifyContent:'space-between',gap:10},cardTitle:{fontSize:18,fontWeight:'800',color:colors.text,flex:1},badge:{fontSize:12,fontWeight:'800',color:colors.secondary},meta:{color:colors.muted},description:{color:colors.text}})
