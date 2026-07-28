import { useState } from 'react'
import { Alert, Text } from 'react-native'
import { Header } from '@/components/Header'
import { Screen } from '@/components/Screen'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/services/api'
export default function Profile(){const {user,refreshUser}=useAuth();const [name,setName]=useState(user?.name||'');const [phone,setPhone]=useState(user?.phone||'');async function save(){try{await api.put(`/usuarios/${user?.id}`,{name,phone});await refreshUser();Alert.alert('Perfil','Dados atualizados com sucesso.')}catch{Alert.alert('Erro','Não foi possível atualizar o perfil.')}}return <Screen><Header title="Meu perfil" back/><Text style={{color:'#C8D5E3'}}>Atualize seus dados pessoais.</Text><Input value={name} onChangeText={setName} placeholder="Nome"/><Input value={user?.email} editable={false}/><Input value={phone} onChangeText={setPhone} placeholder="Telefone"/><Input value={user?.role==='VOLUNTEER'?'Voluntário':user?.role==='ADMIN'?'Administrador':'Solicitante'} editable={false}/><Button title="Salvar alterações" onPress={save}/></Screen>}
