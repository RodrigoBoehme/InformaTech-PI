import { useState } from 'react'
import { Alert, Pressable, Text, View, useWindowDimensions } from 'react-native'
import { Link, router } from 'expo-router'
import { Button } from '@/components/Button'
import { colors } from '@/constants/theme'
import { StyleSheet } from 'react-native'
import { ScrollView } from 'react-native'


export default function termos(){
  const {width,height}=useWindowDimensions()

    return(
        <View style={[{ flex: 1, padding: 24, justifyContent: 'center', gap: 14, backgroundColor: colors.background ,  },{width:width,height:height}]}>
            <View style={[styles.glowTop, { top: -height * 0.4, right: -width * 0.8, width: width * 1.4, height: width * 1.3, borderRadius: (width * 1) / 2 }]} />
            <View style={[styles.glowBottom, { bottom: -height * 0.4, left: -width * 0.8, width: width * 1.4, height: width * 1.2, borderRadius: (width * 1) / 2 }]} />
            <View style={[styles.glowBottom, { top: -height * 0.4, left: -width * 0.9, width: width * 1.44, height: width * 1.1, borderRadius: (width * 1) / 2 }]} />
            <ScrollView>
            <Text style={{color:"#fff",fontSize:20,marginTop:20,marginLeft:10}}>Termos de uso</Text>
            <Text style={{color:"#fff", textAlign:"justify",marginBottom:15,marginTop:10,fontSize:9}}>Este documento estabelece os Termos de Uso da plataforma digital InformaTech, desenvolvida com o objetivo de mapear áreas de risco de alagamento no município de São Leopoldo, identificar locais seguros e disponibilizar informações que auxiliem a população e os órgãos competentes em situações de emergência e calamidade pública.
Ao acessar, instalar ou utilizar a plataforma, o usuário declara que leu, compreendeu e concorda com todas as condições estabelecidas neste documento, comprometendo-se a utilizá-la de forma responsável e em conformidade com estes Termos de Uso.
A InformaTech disponibiliza informações baseadas no histórico de enchentes registradas no município, com destaque para os eventos ocorridos desde 1965 e para a enchente de 2024. O aplicativo oferece recursos como mapa interativo das áreas de risco, identificação de locais seguros, indicação de rotas de fuga, visualização de áreas de escape, informações sobre os níveis de alagamento e orientações de prevenção e segurança.
As informações apresentadas têm caráter informativo e de apoio à tomada de decisões. A plataforma não substitui os serviços prestados por órgãos oficiais, como Defesa Civil, Corpo de Bombeiros, SAMU ou demais autoridades públicas, nem garante a inexistência de riscos nas rotas ou locais indicados. Em situações de emergência, o usuário deverá sempre seguir as orientações das autoridades competentes.
Para utilização de determinados recursos, poderá ser necessário o fornecimento de dados pessoais, como nome, telefone e localização. Ao informar esses dados, o usuário declara que são verdadeiros, completos e atualizados. O tratamento dessas informações será realizado em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018), sendo utilizado exclusivamente para o funcionamento da plataforma, melhoria dos serviços e apoio às ações de monitoramento e emergência, não sendo comercializado ou compartilhado para finalidades incompatíveis com os objetivos do projeto.
O usuário compromete-se a utilizar a plataforma de forma ética, responsável e exclusivamente para os fins a que ela se destina. É proibido inserir informações falsas, utilizar o sistema para fins ilícitos, prejudicar seu funcionamento ou praticar qualquer ato que possa colocar terceiros em risco. O descumprimento dessas regras poderá resultar na suspensão ou exclusão do acesso, sem prejuízo das medidas legais cabíveis.
Embora a InformaTech busque manter as informações constantemente atualizadas e o sistema disponível, não garante funcionamento ininterrupto, nem se responsabiliza por falhas técnicas, indisponibilidade do serviço, perda de dados, atrasos na atualização das informações ou por quaisquer danos decorrentes da utilização ou da impossibilidade de utilização da plataforma. Da mesma forma, não se responsabiliza por decisões tomadas pelos usuários com base nas informações disponibilizadas.
Todo o conteúdo presente na plataforma, incluindo textos, mapas, imagens, logotipos, bases de dados, interface, códigos-fonte e demais elementos, é protegido pela legislação de propriedade intelectual, sendo vedada sua reprodução, distribuição, modificação ou utilização sem autorização prévia dos responsáveis pelo projeto.
A InformaTech poderá atualizar ou modificar estes Termos de Uso a qualquer momento, sempre que necessário para aprimorar seus serviços ou atender alterações legais. A versão mais recente permanecerá disponível na plataforma, e a continuidade da utilização implicará na aceitação das novas condições.
Este Termo de Uso é regido pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de São Leopoldo/RS, com exclusão de qualquer outro, por mais privilegiado que seja, para dirimir eventuais controvérsias decorrentes da utilização da plataforma.
</Text>

            <Pressable onPress={()=>{router.back()}} style={{margin:20,marginBottom:30,backgroundColor:colors.primary,alignItems:'center',padding:4,borderRadius:15} }>
                <Text style={{color:"#fff"}}>Voltar</Text>
            </Pressable>
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