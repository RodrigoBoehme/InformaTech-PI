import { useState } from 'react'
import { Alert, Pressable, Text, View, useWindowDimensions } from 'react-native'
import { Link, router } from 'expo-router'
import { Button } from '@/components/Button'
import { colors } from '@/constants/theme'
import { StyleSheet } from 'react-native'
import { ScrollView } from 'react-native'


export default function preparos(){
  const {width,height}=useWindowDimensions()

    return(
        <View style={[{ flex: 1, padding: 24, justifyContent: 'center', gap: 14, backgroundColor: colors.background ,  },{width:width,height:height}]}>
            <View style={[styles.glowTop, { top: -height * 0.4, right: -width * 0.8, width: width * 1.4, height: width * 1.3, borderRadius: (width * 1) / 2 }]} />
            <View style={[styles.glowBottom, { bottom: -height * 0.4, left: -width * 0.8, width: width * 1.4, height: width * 1.2, borderRadius: (width * 1) / 2 }]} />
            <View style={[styles.glowBottom, { top: -height * 0.4, left: -width * 0.9, width: width * 1.44, height: width * 1.1, borderRadius: (width * 1) / 2 }]} />
            <ScrollView>
            <ScrollView showsVerticalScrollIndicator={false}>
  <Text style={{ color: "#fff", fontSize: 24, marginTop: 20, marginBottom: 15, textAlign: "center", fontWeight: "bold" }}>
    O que levar em caso de enchente
  </Text>

  <Text style={{ color: "#35e6c6", fontSize: 18, fontWeight: "bold", marginTop: 10 }}>
    📄 Documentos
  </Text>

  <Text style={{ color: "#fff", textAlign: "justify", marginTop: 5, fontSize: 14 }}>
    • RG e CPF{"\n"}
    • Certidão de nascimento ou casamento{"\n"}
    • Cartão do SUS{"\n"}
    • Cartões bancários{"\n"}
    • Documentos do veículo{"\n"}
    • Coloque tudo em um saco plástico ou pasta impermeável.
  </Text>

  <Text style={{ color: "#35e6c6", fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
    👕 Roupas
  </Text>

  <Text style={{ color: "#fff", textAlign: "justify", marginTop: 5, fontSize: 14 }}>
    • Troca de roupas{"\n"}
    • Casaco{"\n"}
    • Roupa íntima{"\n"}
    • Toalha{"\n"}
    • Calçado fechado ou botas.
  </Text>

  <Text style={{ color: "#35e6c6", fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
    🍞 Alimentos
  </Text>

  <Text style={{ color: "#fff", textAlign: "justify", marginTop: 5, fontSize: 14 }}>
    • Água potável{"\n"}
    • Barras de cereal{"\n"}
    • Biscoitos{"\n"}
    • Enlatados{"\n"}
    • Leite longa vida{"\n"}
    • Abridor de latas.
  </Text>

  <Text style={{ color: "#35e6c6", fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
    💊 Medicamentos
  </Text>

  <Text style={{ color: "#fff", textAlign: "justify", marginTop: 5, fontSize: 14 }}>
    • Remédios de uso contínuo{"\n"}
    • Kit de primeiros socorros{"\n"}
    • Máscaras{"\n"}
    • Álcool em gel.
  </Text>

  <Text style={{ color: "#35e6c6", fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
    🔦 Itens importantes
  </Text>

  <Text style={{ color: "#fff", textAlign: "justify", marginTop: 5, fontSize: 14 }}>
    • Lanterna{"\n"}
    • Pilhas extras{"\n"}
    • Carregador de celular{"\n"}
    • Power Bank carregado{"\n"}
    • Rádio portátil{"\n"}
    • Apito{"\n"}
    • Dinheiro em espécie.
  </Text>

  <Text style={{ color: "#35e6c6", fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
    🐶 Se houver animais
  </Text>

  <Text style={{ color: "#fff", textAlign: "justify", marginTop: 5, fontSize: 14 }}>
    • Ração{"\n"}
    • Água{"\n"}
    • Coleira e guia{"\n"}
    • Caixa de transporte, se possível{"\n"}
    • Medicamentos do animal.
  </Text>

  <Text style={{ color: "#FFD54F", textAlign: "justify", marginTop: 25, fontSize: 14 }}>
    ⚠️ Sempre saia de casa quando houver orientação da Defesa Civil ou das autoridades. Nunca tente atravessar áreas alagadas a pé ou de carro.
  </Text>

  <Pressable
    onPress={() => router.back()}
    style={{
      margin: 20,
      marginBottom: 30,
      backgroundColor: colors.primary,
      alignItems: "center",
      padding: 12,
      borderRadius: 15,
    }}
  >
    <Text style={{ color: "#fff", fontWeight: "bold" }}>
      Voltar
    </Text>
  </Pressable>
</ScrollView>
            </ScrollView>



        </View>
    )
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712", 
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24, // Ajustado conforme base da sugestão
    paddingVertical: 20,
  },
  glowTop: {
    position: "absolute",
    backgroundColor: "rgba(132, 204, 22, 0.12)", 
  },
  glowBottom: {
    position: "absolute",
    backgroundColor: "rgba(30, 41, 59, 0.5)", 
  },
  mainContent: {
    flex: 1,
    width: "100%",
    maxWidth: 500, // Expandido para tablets (Sugestão 8)
    justifyContent: "center",
  },
  brandContainer: {
    alignItems: "center",
  },
  logoWrapper: {
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    marginBottom: 32,
  },
  logo: {},
  title: {
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1.5,
    marginBottom: 16,
    textAlign: "center",
  },
  titleAccent: {
    color: "#35e6c6", 
  },
  subtitle: {
    color: "#9CA3AF", 
    textAlign: "center",
    maxWidth: 340, // Limitado para não quebrar feio (Sugestão 5)
    paddingHorizontal: 12,
  },
  actionGroup: {
    width: "100%",
    gap: 16,
  },
  btnPrimaryContainer: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  btnGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnPrimaryText: {
    color: "#061500",
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  btnSecondary: {
    width: "100%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  btnSecondaryText: {
    color: "#E5E7EB",
    fontWeight: "600",
  },
  btnPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.85,
  },
  footerContainer: {
    alignItems: "center",
    width: "100%",
    gap: 16,
    marginTop: 10,
  },
  footerLine: {
    width: 40,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 1,
  },
  footerText: {
    color: "#4B5563",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});