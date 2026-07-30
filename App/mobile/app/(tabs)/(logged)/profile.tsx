import { useState } from 'react'
import { Alert, StyleSheet, Text, View, ScrollView ,useWindowDimensions} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { Header } from '@/components/Header'
import { Screen } from '@/components/Screen'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/services/api'
import Background1 from '@/components/Background'


export default function Profile() {
  const { user, refreshUser } = useAuth()

  const {width, height}=useWindowDimensions()
  
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [loading, setLoading] = useState(false)

  // Mapeamento de papéis (Roles) do usuário para exibição amigável
  const roleLabels: Record<string, string> = {
    VOLUNTEER: 'Voluntário',
    ADMIN: 'Administrador',
    USER: 'Solicitante',
  }

  async function handleSave() {
    if (!name.trim()) {
      return Alert.alert('Atenção', 'O campo nome não pode ficar vazio.')
    }

    try {
      setLoading(true)
      await api.put(`/usuarios/${user?.id}`, { name, phone })
      await refreshUser()
      Alert.alert('Perfil', 'Dados atualizados com sucesso!')
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen style={s.screenContainer}>
      <Background1 width={width} height={height}/>

      {/* Cabeçalho */}
      <Header title="Meu Perfil" title2ndPart=''/>

      <ScrollView 
        contentContainerStyle={s.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar e Boas-vindas */}
        <View style={s.avatarSection}>
          <View style={s.avatarContainer}>
            <Ionicons name="person" size={48} color="#FFFFFF" />
          </View>
          <Text style={s.profileTitle}>{user?.name || 'Usuário'}</Text>
          <Text style={s.subtitle}>Mantenha seus dados sempre atualizados.</Text>
        </View>

        {/* Card do Formulário */}
        <View style={s.card}>
          <View style={s.inputGroup}>
            <Text style={s.label}>Nome completo</Text>
            <Input 
              value={name} 
              onChangeText={setName} 
              placeholder="Digite seu nome"
            />
          </View>

          <View style={s.inputGroup}>
            <Text style={s.label}>E-mail (não editável)</Text>
            <Input 
              value={user?.email} 
              editable={false} 
              style={s.disabledInput}
            />
          </View>

          <View style={s.inputGroup}>
            <Text style={s.label}>Telefone / WhatsApp</Text>
            <Input 
              value={phone} 
              onChangeText={setPhone} 
              placeholder="(00) 00000-0000"
              keyboardType="phone-pad"
            />
          </View>

          <View style={s.inputGroup}>
            <Text style={s.label}>Tipo de Conta</Text>
            <Input 
              value={roleLabels[user?.role || ''] || 'Solicitante'} 
              editable={false}
              style={s.disabledInput}
            />
          </View>

          {/* Botão de Ação */}
          <View style={s.buttonContainer}>
            <Button 
              title={loading ? "Salvando..." : "Salvar Alterações"} 
              onPress={handleSave}
              disabled={loading}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  )
}

const s = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
    marginBottom: 12,
  },
  profileTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  disabledInput: {
    opacity: 0.7,
  },
  buttonContainer: {
    marginTop: 10,
  },
})