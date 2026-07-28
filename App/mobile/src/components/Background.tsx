import { View,StyleSheet,useWindowDimensions } from "react-native"

type Props={
    height:number
    width:number

}
export default function Background1(Props:Props){
 
  const {width,height}= Props
    return(
    <View>
          <View style={[styles.glowTop, { top: -height * 0.4, right: -width * 0.8, width: width * 1.4, height: width * 1.3, borderRadius: (width * 1) / 2 }]} />
      <View style={[styles.glowBottom, { bottom: -height * 0.4, left: -width * 0.8, width: width * 1.4, height: width * 1.2, borderRadius: (width * 1) / 2 }]} />
      <View style={[styles.glowBottom, { top: -height * 0.4, left: -width * 0.9, width: width * 1.44, height: width * 1.1, borderRadius: (width * 1) / 2 }]} />
    </View>
    )
}


const styles=StyleSheet.create({
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
})