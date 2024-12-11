import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, Modal, Pressable, Button, InteractionManager, Appearance, useColorScheme, DeviceEventEmitter } from "react-native";
import styles from "../styles/styles";
import icon from "../../assets/icon.png";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../ThemeContext"; // Usando o hook useTheme para acessar o estado do tema
import { AtualizarThemeAsync, ObterEstabelecimentoAsync, ObterThemeAsync } from "../../services/estabelecimentoService";

const Header = ({ title, primeiraInicializacao, atualizarDB }) => {
  const { theme, toggleTheme } = useTheme();
  const [ themaEscolhido, setTemaEscolhido ] = useState();
  const [estabelecimento, setEstabelecimento] = useState(null);

  const [themeSistema, setThemeSistema] = useState(useColorScheme()); // Definindo o tema inicial  

  // Estilos baseados no tema atual
  const textColor = theme === "dark" ? "white" : "black";
  const textColor2 = theme === "dark" ? "black" : "white";

  const setTema = async (tema) => {
    setTemaEscolhido(tema);
    await AtualizarThemeAsync(tema);
    toggleTheme(tema);
  };

  const themaEscolhido2 = async() => {
    let themaDobanco = await ObterThemeAsync();
    setTemaEscolhido(themaDobanco);
    toggleTheme(themaDobanco);
    return themaDobanco;
  }

  useEffect(() => {
    themaEscolhido2();
  }, []);

  useEffect(() => {
    ObterEstabelecimentoAsync().then((estabelecimento) => {
      setEstabelecimento(estabelecimento.data);
    });

    DeviceEventEmitter.addListener("atualizarEstabelecimento", () => {
      ObterEstabelecimentoAsync().then((estabelecimento) => {
        setEstabelecimento(estabelecimento.data);
      });
    });
  }, [primeiraInicializacao, atualizarDB]);

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
            {themaEscolhido == "auto" && (<Text onPress={() => setTema("dark")} style={{ paddingLeft: 7, paddingRight: 7, fontWeight: "bold", borderRadius:100, color:"white"}}>AUTO</Text>)}
            {themaEscolhido == "light" && (<Ionicons onPress={() => setTema("auto")} name="sunny-outline" size={25} color={"white"} />)}
            {themaEscolhido == "dark" && (<Ionicons onPress={() => setTema("light")} name="moon-outline" size={25} color={"white"} />)}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};
export default Header;
