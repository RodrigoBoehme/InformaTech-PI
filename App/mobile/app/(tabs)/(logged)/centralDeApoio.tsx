import React from 'react'
import {
  Text,
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions
} from 'react-native'
import { router } from 'expo-router'
import { colors } from '@/constants/theme'
import { Screen } from '@/components/Screen'
import Background1 from '@/components/Background'

export default function CentralEmergencia() {
  const { width, height } = useWindowDimensions()

  return (
    <Screen headr={{title:"Central",title2ndPart:"e Apoio"}} scroll={false}>
      {/* Luzes de fundo */}
      <Background1 width={width} height={height}/>
            <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cabeçalho de Alerta Primário */}
        <View style={styles.header}>
          <Text style={styles.badge}>EMERGÊNCIA</Text>
          <Text style={styles.title}>Central de Apoio</Text>
          <Text style={styles.subtitle}>
            Ações essenciais e informações rápidas para segurança em enchentes.
          </Text>
        </View>

        {/* 1. NÚMEROS ÚTEIS */}
        <View style={styles.emergencyCard}>
          <Text style={styles.emergencyCardTitle}>📞 Telefones de Emergência</Text>

          <View style={styles.phoneGrid}>
            <View style={styles.phoneBox}>
              <Text style={styles.phoneLabel}>Defesa Civil</Text>
              <Text style={styles.phoneNumber}>199</Text>
            </View>
            <View style={styles.phoneBox}>
              <Text style={styles.phoneLabel}>Bombeiros</Text>
              <Text style={styles.phoneNumber}>193</Text>
            </View>
            <View style={styles.phoneBox}>
              <Text style={styles.phoneLabel}>SAMU</Text>
              <Text style={styles.phoneNumber}>192</Text>
            </View>
            <View style={styles.phoneBox}>
              <Text style={styles.phoneLabel}>Polícia</Text>
              <Text style={styles.phoneNumber}>190</Text>
            </View>
          </View>
        </View>

        {/* 2. REGRAS DE OURO */}
        <Text style={styles.sectionTitle}>Regras de Ouro</Text>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>⚡ 1. Desligue a Energia</Text>
          <Text style={styles.cardText}>
            Desligue o disjuntor geral de energia e o registro de gás assim que notar risco de alagamento.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>🚶 2. Evacue Cedo</Text>
          <Text style={styles.cardText}>
            Não espere a água subir. Saia de casa ao primeiro aviso das autoridades ou sinal de perigo.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>🚫 3. Não Atravesse Água</Text>
          <Text style={styles.cardText}>
            Apenas 15cm de água em movimento podem derrubar uma pessoa. Carros podem ser arrastados com 30cm.
          </Text>
        </View>

        {/* 3. ATALHO PARA CHECKLIST DE PREPAROS */}
        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>🎒 Mochila de Emergência</Text>
          <Text style={styles.actionText}>
            Veja o que separar urgentemente (Documentos, Remédios, Água e Mantimentos).
          </Text>

          <Pressable
            onPress={() => router.navigate('/preparos')}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed
            ]}
          >
            <Text style={styles.primaryButtonText}>Ver Lista Completa</Text>
          </Pressable>
        </View>



      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
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
    color: '#FF5252',
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
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
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center'
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6
  },
  emergencyCard: {
    backgroundColor: 'rgba(255, 82, 82, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 82, 0.3)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 28
  },
  emergencyCardTitle: {
    color: '#FF5252',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center'
  },
  phoneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between'
  },
  phoneBox: {
    width: '48%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center'
  },
  phoneLabel: {
    color: '#9CA3AF',
    fontSize: 12
  },
  phoneNumber: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 2
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12
  },
  cardHeader: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6
  },
  cardText: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20
  },
  actionCard: {
    backgroundColor: 'rgba(53, 230, 198, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(53, 230, 198, 0.2)',
    borderRadius: 18,
    padding: 20,
    marginTop: 16,
    alignItems: 'center'
  },
  actionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6
  },
  actionText: {
    color: '#9CA3AF',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16
  },
  primaryButton: {
    backgroundColor: colors.primary,
    width: '100%',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  primaryButtonText: {
    color: '#030712',
    fontWeight: '700',
    fontSize: 15
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
    marginTop: 16
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