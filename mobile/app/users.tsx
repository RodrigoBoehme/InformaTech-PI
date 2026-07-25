import { useCallback, useState } from 'react'
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { Header } from '@/components/Header'
import { Screen } from '@/components/Screen'
import { Button } from '@/components/Button'
import { api } from '@/services/api'
import { Usuario } from '@/types'
import { colors } from '@/constants/theme'
export default function Users(){const [items,setItems]=useState<Usuario[]>([]);const load=useCallback(()=>api.get('/usuarios').then(r=>setItems(r.data)).catch(()=>Alert.alert('Erro','Acesso exclusivo para administradores.')),[]);useFocusEffect(useCallback(()=>{load()},[load]));async function toggle(item:Usuario){await api.put(`/usuarios/${item.id}`,{active:!item.active});load()}async function remove(id:string){Alert.alert('Excluir usuário','Esta ação também pode remover dados relacionados.',[{text:'Cancelar'},{text:'Excluir',style:'destructive',onPress:async()=>{await api.delete(`/usuarios/${id}`);load()}}])}return <Screen scroll={false}><Header title="Usuários" back/><FlatList data={items} keyExtractor={i=>i.id} contentContainerStyle={{gap:12,paddingBottom:30}} renderItem={({item})=><View style={s.card}><Text style={s.title}>{item.name}</Text><Text style={s.meta}>{item.email} • {item.phone}</Text><Text style={s.meta}>Perfil: {item.role} • {item.active?'Ativo':'Inativo'}</Text><View style={{flexDirection:'row',gap:8}}><Button style={{flex:1}} title={item.active?'Desativar':'Ativar'} variant="outline" onPress={()=>toggle(item)}/><Button style={{flex:1}} title="Excluir" variant="danger" onPress={()=>remove(item.id)}/></View></View>}/></Screen>}
const s=StyleSheet.create({card:{backgroundColor:colors.card,padding:16,borderRadius:16,gap:8},title:{fontSize:17,fontWeight:'800',color:colors.text},meta:{color:colors.muted}})
