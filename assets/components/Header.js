import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, Modal, Pressable, Button, InteractionManager, Appearance, DeviceEventEmitter } from "react-native";
import styles from "../styles/styles";
import icon from "../../assets/icon.png";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../ThemeContext"; // Usando o hook useTheme para acessar o estado do tema
import { ObterEstabelecimentoAsync } from "../../services/estabelecimentoService";

const Header = ({ title, primeiraInicializacao }) => {
  const { themeAuto, togglethemeAuto } = useTheme();
  const { theme, toggleTheme } = useTheme();
  const [estabelecimento, setEstabelecimento] = useState(null);

  // Estilos baseados no tema atual
  const textColor = theme === "dark" ? "white" : "dark";
  const textColor2 = theme === "dark" ? "black" : "white";

  const ToggleThema = () => {
    if (theme === "dark") {
      toggleTheme("light");
    } else if (theme === "light") {
      toggleTheme("auto");
    }else{
      toggleTheme("dark");
    }
  };
  

  useEffect(() => {
    ObterEstabelecimentoAsync().then((estabelecimento) => {
      setEstabelecimento(estabelecimento.data);
    });

    DeviceEventEmitter.addListener("atualizarEstabelecimento", () => {
      ObterEstabelecimentoAsync().then((estabelecimento) => {
        setEstabelecimento(estabelecimento.data);
      });
    });
  }, [primeiraInicializacao]);

  const getLogoSource = () => {
    if (estabelecimento && estabelecimento.Logo) {
      try {
        const logoData = JSON.parse(estabelecimento.Logo);
        if (logoData.base64) {
          return { uri: `data:image/jpeg;base64,${logoData.base64}` };
        }
      } catch (error) {
        console.error("Erro ao parsear a Logo:", error);
      }
    }
    //caso nao dê certo acima, retorna o icon
    return icon;
  };

  return (
    <View>
      <LinearGradient colors={["#000000", "#0055c6"]} start={{ x: 0.5, y: 0.2 }} style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Image source={getLogoSource()} style={styles.logo} />
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around" }}>
            <View>
              <Text numberOfLines={1} style={styles.shopName}>
                {!primeiraInicializacao && estabelecimento ? estabelecimento.Nome : "LTAG CALENDAR"}
              </Text>
              <Text style={styles.shopName_}>{title}</Text>
            </View>
            {/* <Text style={styles.shopName_}>SEJA BEM-VINDO!!</Text> */}
            <View style={{ marginLeft: 25, backgroundColor:textColor, justifyContent:'center', borderRadius:100, height:25}}>
              {theme != 'auto'? 
              (<Ionicons name="contrast-outline" size={25} color={textColor2} onPress={ToggleThema} />) 
              : 
              (<Text onPress={ToggleThema} style={{paddingLeft:7, paddingRight:7, fontWeight:"bold"}}>AUTO</Text>)
               }
              <Text>{theme}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};
export default Header;
