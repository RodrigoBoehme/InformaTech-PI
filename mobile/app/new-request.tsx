import { useState } from 'react'
import { Alert, Text } from 'react-native'
import * as Location from 'expo-location'
import { router } from 'expo-router'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Header } from '@/components/Header'
import { Screen } from '@/components/Screen'
import { api } from '@/services/api'
import { colors } from '@/constants/theme'
export default function NewRequest(){
 const [form,setForm]=useState({title:'',description:'',category:'Resgate',priority:'HIGH',address:'',latitude:'',longitude:''}); const [loading,setLoading]=useState(false)
 async function locate(){const {status}=await Location.requestForegroundPermissionsAsync();if(status!=='granted')return Alert.alert('Localização','Permita o acesso à localização.');const l=await Location.getCurrentPositionAsync({});setForm(f=>({...f,latitude:String(l.coords.latitude),longitude:String(l.coords.longitude)}))}
 async function save(){if(!form.title||!form.description||!form.latitude)return Alert.alert('Campos obrigatórios','Preencha título, descrição e localização.');try{setLoading(true);await api.post('/pedidos',form);router.replace('/home')}catch(e:any){Alert.alert('Erro',e?.response?.data?.message||'Não foi possível salvar o pedido.')}finally{setLoading(false)}}
 return <Screen><Header title="Novo pedido" back/><Text style={{color:'#C8D5E3'}}>Descreva claramente a necessidade para facilitar o atendimento.</Text><Input placeholder="Título" value={form.title} onChangeText={title=>setForm({...form,title})}/><Input placeholder="Descrição" multiline value={form.description} onChangeText={description=>setForm({...form,description})}/><Input placeholder="Categoria" value={form.category} onChangeText={category=>setForm({...form,category})}/><Input placeholder="Prioridade: LOW, MEDIUM, HIGH ou CRITICAL" value={form.priority} onChangeText={priority=>setForm({...form,priority})}/><Input placeholder="Endereço ou referência" value={form.address} onChangeText={address=>setForm({...form,address})}/><Input placeholder="Latitude" keyboardType="numeric" value={form.latitude} onChangeText={latitude=>setForm({...form,latitude})}/><Input placeholder="Longitude" keyboardType="numeric" value={form.longitude} onChangeText={longitude=>setForm({...form,longitude})}/><Button title="Usar minha localização" variant="outline" onPress={locate}/><Button title="Salvar pedido" loading={loading} onPress={save}/><Text style={{color:colors.muted,textAlign:'center'}}>A localização é usada apenas para apresentar o pedido no mapa.</Text></Screen>
}
