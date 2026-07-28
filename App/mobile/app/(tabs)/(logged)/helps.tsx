import { useCallback, useState } from 'react'
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { Header } from '@/components/Header'
import { Screen } from '@/components/Screen'
import { Button } from '@/components/Button'
import { api } from '@/services/api'
import { Ajuda } from '@/types'
import { colors } from '@/constants/theme'
const label={OFFERED:'Oferecida',ACCEPTED:'Aceita',COMPLETED:'Concluída',CANCELED:'Cancelada'} as Record<string,string>
export default function Helps(){const [items,setItems]=useState<Ajuda[]>([]);const load=useCallback(()=>api.get('/ajudas').then(r=>setItems(r.data)).catch(()=>Alert.alert('Erro','Não foi possível carregar as ajudas.')),[]);useFocusEffect(useCallback(()=>{load()},[load]));async function finish(id:string){await api.put(`/ajudas/${id}`,{status:'COMPLETED'});load()}return <Screen scroll={false}><Header title="Ofertas de ajuda" back/><FlatList data={items} keyExtractor={i=>i.id} ListEmptyComponent={<Text style={{color:'#C8D5E3'}}>Nenhuma oferta de ajuda registrada.</Text>} contentContainerStyle={{gap:12}} renderItem={({item})=><View style={s.card}><Text style={s.title}>{item.volunteer?.name||'Voluntário'}</Text><Text>{item.message}</Text><Text style={s.meta}>Situação: {label[item.status]}</Text>{item.status!=='COMPLETED'&&<Button title="Marcar como concluída" variant="outline" onPress={()=>finish(item.id)}/>}</View>}/></Screen>}
const s=StyleSheet.create({card:{backgroundColor:colors.card,padding:16,borderRadius:16,gap:8},title:{fontSize:17,fontWeight:'800'},meta:{color:colors.muted}})
