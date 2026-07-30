import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { colors } from '@/constants/theme';

interface HeaderProps {
  title?: string;
  onLogout?: () => void;
  action?: React.ReactNode;
  title2ndPart?:string;
}

export function Header({ title = 'Informa',title2ndPart="Tech" ,onLogout, action }: HeaderProps) {
  // Função padrão de logout caso nenhuma seja passada via prop
  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      router.replace('/') // Redireciona para a tela inicial/login
    }
  }

  return (
    <View style={s.container}>
      {/* Canto Esquerdo: Nome do App */}
      <Text style={s.title}>{title}<Text style={s.title2}>{title2ndPart}</Text></Text>

      {/* Canto Direito: Botão Sair personalizado ou padrão */}
      {action ? (
        action
      ) : (
        <Pressable onPress={handleLogout} style={s.logoutButton}>
          <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
          <Text style={s.logoutText}>Sair</Text>
        </Pressable>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    backgroundColor: '#000000', // Retângulo com fundo preto
    minHeight: 8, // Altura aproximada do header
    flexDirection: 'row',
    alignItems: 'center', // Centraliza os itens verticalmente
    justifyContent: 'space-between', // Joga o título para a esquerda e o botão para a direita
    paddingHorizontal: 20,
    paddingTop: 1, // Espaço para não ficar atrás da barra de status do celular
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF', // Texto branco sobre o fundo preto
  },
  title2:{
    color:colors.primary
  }
  ,
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // Espaçamento entre o ícone e a palavra 'Sair'
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#1C1C1E', // Um leve contraste cinza escuro para o botão (opcional)
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})