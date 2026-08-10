import { Screen } from "@/components/Screen"
import Background1 from '@/components/Background'
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'





export default function Pedidos() {
    const {height,width}=useWindowDimensions()

    return(
      <Screen headr={{title:"Ped",title2ndPart:"idos"}} scroll={false}>
        <Background1 width={width} height={height}/>


      </Screen>



    )
}