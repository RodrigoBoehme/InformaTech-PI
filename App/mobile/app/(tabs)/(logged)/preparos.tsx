import React from 'react'
import {
  Text,
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
  TextStyle
} from 'react-native'
import { router } from 'expo-router'
import { colors } from '@/constants/theme'
import { Screen } from '@/components/Screen'
import Background1 from '@/components/Background'

export default function Preparos(): React.JSX.Element {
  const { width, height } = useWindowDimensions()

  return (

    <Screen headr={{title:"Prepa",title2ndPart:"rativos"}}>
      <Background1 width={width} height={height}/>
      
      {/* Luz de fundo */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.badge}>CHECKLIST</Text>
          <Text style={styles.title}>Mochila de Emergência</Text>
          <Text style={styles.subtitle}>
            Itens prioritários para separar rapidamente e levar com você.
          </Text>
        </View>

        {/* Card: Documentos */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📄 Documentos</Text>
          <Text style={styles.cardItem}>RG e CPF</Text>
          <Text style={styles.cardItem}>Certidão de nascimento ou casamento</Text>
          <Text style={styles.cardItem}>Cartão do SUS e convênio</Text>
          <Text style={styles.cardItem}>Cartões bancários e dinheiro</Text>
          <Text style={styles.cardItem}>Documentos do veículo</Text>
          <Text style={styles.cardItem}>Comprovante de Residência </Text>
          <Text style={styles.highlightTip}>
            💡 Guarde tudo em saco plástico vedado ou pasta impermeável.
          </Text>
        </View>

        {/* Card: Roupas */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👕 Roupas</Text>
          <Text style={styles.cardItem}>Troca de roupas secas</Text>
          <Text style={styles.cardItem}>Casaco impermeável / agasalho</Text>
          <Text style={styles.cardItem}>Roupas íntimas e meias</Text>
          <Text style={styles.cardItem}>Toalha de rosto ou banho</Text>
          <Text style={styles.cardItem}>Calçado fechado ou botas de borracha</Text>
        </View>

        {/* Card: Alimentos */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🍞 Alimentos e Água</Text>
          <Text style={styles.cardItem}>Garrafas de água potável</Text>
          <Text style={styles.cardItem}>Barras de cereal e biscoitos</Text>
          <Text style={styles.cardItem}>Comidas enlatadas e fáceis de abrir</Text>
          <Text style={styles.cardItem}>Leite longa vida</Text>
          <Text style={styles.cardItem}>Abridor de latas</Text>
        </View>

        {/* Card: Medicamentos */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💊 Saúde e Higiene</Text>
          <Text style={styles.cardItem}>Remédios de uso contínuo</Text>
          <Text style={styles.cardItem}>Kit de primeiros socorros</Text>
          <Text style={styles.cardItem}>Máscaras e álcool em gel</Text>
          <Text style={styles.cardItem}>Papel higiênico e lenços umedecidos</Text>
        </View>

        {/* Card: Equipamentos */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔦 Equipamentos Importantes</Text>
          <Text style={styles.cardItem}>Lanterna e pilhas extras</Text>
          <Text style={styles.cardItem}>Carregador de celular e Power Bank</Text>
          <Text style={styles.cardItem}>Rádio portátil a pilha</Text>
          <Text style={styles.cardItem}>Apito para sinalização de resgate</Text>
        </View>

        {/* Card: Animais */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🐶 Se Houver Animais</Text>
          <Text style={styles.cardItem}>Ração e água potável</Text>
          <Text style={styles.cardItem}>Coleira, guia e identificação</Text>
          <Text style={styles.cardItem}>Caixa ou bolsa de transporte</Text>
          <Text style={styles.cardItem}>Medicamentos do pet</Text>
        </View>

        {/* Botão de Voltar para a Central */}
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed
          ]}
        >
          <Text style={styles.secondaryButtonText}>← Voltar para a Central</Text>
        </Pressable>
      </ScrollView>
      </Screen>      
  )
}

interface Styles {
  container: ViewStyle
  glowTop: ViewStyle
  scrollContent: ViewStyle
  header: ViewStyle
  badge: TextStyle
  title: TextStyle
  subtitle: TextStyle
  card: ViewStyle
  cardTitle: TextStyle
  cardItem: TextStyle
  highlightTip: TextStyle
  secondaryButton: ViewStyle
  secondaryButtonText: TextStyle
  buttonPressed: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    position: 'relative'
  },
  glowTop: {
    position: 'absolute',
    backgroundColor: 'rgba(53, 230, 198, 0.12)'
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%'
  },
  header: {
    alignItems: 'center',
    marginBottom: 24
  },
  badge: {
    color: '#35e6c6',
    backgroundColor: 'rgba(53, 230, 198, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center'
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    alignItems: 'center',
    gap: 6
  },
  cardTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center'
  },
  cardItem: {
    color: '#E5E7EB',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center'
  },
  highlightTip: {
    color: '#9CA3AF',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    textAlign: 'center',
    width: '100%'
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    width: '100%',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }]
  }
})