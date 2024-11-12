import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, Modal, Pressable, Button, InteractionManager, Appearance } from "react-native";
import styles from "../styles/styles";
import icon from "../../assets/icon.png";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../ThemeContext"; // Usando o hook useTheme para acessar o estado do tema
import { ObterEstabelecimentoAsync } from "../../services/estabelecimentoService";

const Header = ({ title, primeiraInicializacao }) => {
  const { theme, toggleTheme } = useTheme();
  const [estabelecimento, setEstabelecimento] = useState(null);

  // Estilos baseados no tema atual
  const headerStyles = theme === "dark" ? styles.darkHeader : styles.lightHeader;
  const textColor = theme === "dark" ? "white" : "black";
  const ToggleThema = () => {
    if (theme === "dark") {
      toggleTheme("light");
    } else if (theme === "light") {
      toggleTheme("dark");
    }
  };

  // useEffect(() => {
  //   ObterEstabelecimentoAsync().then((estabelecimento) => {
  //     console.log(estabelecimento);
  //     // setEstabelecimento(estabelecimento.data);
  //   });
  // }, []);

  useEffect(() => {
    ObterEstabelecimentoAsync().then((estabelecimento) => {
      setEstabelecimento(estabelecimento.data);
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
              <Text style={styles.shopName}>{!primeiraInicializacao && estabelecimento ? estabelecimento.Nome : "LTAG CALENDAR"}</Text>
              <Text style={styles.shopName_}>{title}</Text>
            </View>
            {/* <Text style={styles.shopName_}>SEJA BEM-VINDO!!</Text> */}
            <View style={{ marginLeft: 25 }}>
              <Ionicons name="contrast-outline" size={25} color="white" onPress={ToggleThema} />
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};
export default Header;
