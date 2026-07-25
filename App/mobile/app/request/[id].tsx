import { useCallback, useState } from 'react'
import { Alert, StyleSheet, Text } from 'react-native'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { Header } from '@/components/Header'
import { Screen } from '@/components/Screen'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { api } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'
import { Pedido } from '@/types'
import { colors } from '@/constants/theme'
export default function RequestDetail(){const {id}=useLocalSearchParams<{id:string}>();const {user}=useAuth();const [item,setItem]=useState<Pedido|null>(null);const [message,setMessage]=useState('Posso ajudar com este pedido.');const load=useCallback(()=>api.get(`/pedidos/${id}`).then(r=>setItem(r.data)).catch(()=>Alert.alert('Erro','Pedido não encontrado.')),[id]);useFocusEffect(useCallback(()=>{load()},[load]));async function offer(){await api.post('/ajudas',{requestId:id,message});Alert.alert('Ajuda oferecida','Sua oferta foi registrada.')}async function remove(){await api.delete(`/pedidos/${id}`);router.replace('/home')}if(!item)return <Screen><Header title="Pedido" back/><Text style={{color:'#fff'}}>Carregando...</Text></Screen>;return <Screen><Header title="Detalhes do pedido" back/><Text style={s.title}>{item.title}</Text><Text style={s.meta}>{item.category} • {item.status}</Text><Text style={s.body}>{item.description}</Text>{item.address?<Text style={s.body}>Local: {item.address}</Text>:null}{user?.role==='VOLUNTEER'&&item.status==='OPEN'?<><Input value={message} onChangeText={setMessage} multiline/><Button title="Oferecer ajuda" onPress={offer}/></>:null}{(user?.id===item.requesterId||user?.role==='ADMIN')?<Button title="Excluir pedido" variant="danger" onPress={()=>Alert.alert('Excluir pedido','Confirma a exclusão?',[{text:'Cancelar'},{text:'Excluir',style:'destructive',onPress:remove}])}/>:null}</Screen>}
const s=StyleSheet.create({title:{fontSize:26,fontWeight:'800',color:colors.card},meta:{color:'#9FB1C4'},body:{color:colors.card,fontSize:16,lineHeight:24}})
