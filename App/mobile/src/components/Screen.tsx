import { ReactNode } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '@/constants/theme'

import { Header } from './Header'


interface HeaderProps {
    title?: string;
    onLogout?: () => Promise<void>;
    action?: React.ReactNode;
    title2ndPart?:string;
  }

export function Screen( {
    headr={title:"",title2ndPart:""},
    children,
    scroll = true,
    style,
  }: {
    children: ReactNode
    scroll?: boolean,
    style?: ViewStyle,
    headr:{title?:string,    onLogout?: () => Promise<void>;action?: React.ReactNode;title2ndPart?:string;}
  }) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <Header title={headr.title} title2ndPart={headr.title2ndPart} onLogout={headr.onLogout} action={headr.action} />
        <SafeAreaView style={styles.inner}>
          {scroll ? (
            <ScrollView
              contentContainerStyle={[styles.content, style]}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>
          ) : (
            <SafeAreaView style={[styles.content, { flex: 1 }, style]}>
              {children}
            </SafeAreaView>
          )}
        </SafeAreaView>
      </SafeAreaView>
    )
  }

  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: '#000', // moldura preta
      padding: 6,              // espessura da moldura
    },
  
    inner: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: 18,        // arredonda APENAS a parte interna
      overflow: 'hidden',      // corta os filhos nas bordas
    },
  
    content: {
      padding: 0,
      gap: 14,
    },
  })