import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, Modal, Pressable, Button, InteractionManager, Appearance, DeviceEventEmitter } from "react-native";
import styles from "../styles/styles";
import icon from "../../assets/icon.png";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../ThemeContext"; // Usando o hook useTheme para acessar o estado do tema
import { ObterEstabelecimentoAsync } from "../../services/estabelecimentoService";

const Header = ({ title, primeiraInicializacao, atualizarDB }) => {
  const { theme, toggleTheme } = useTheme();
  const [estabelecimento, setEstabelecimento] = useState(null);

  // Estilos baseados no tema atual
  const textColor = theme === "dark" ? "white" : "black";
  const textColor2 = theme === "dark" ? "black" : "white";
  const [cont, setcont] = useState("1");
  const [teste, setteste] = useState("0");

  // useEffect(() => {
  //   console.log("Tema atual:", theme);
  // }, [theme]);

  const setTheme = () => {
    if (cont == "2") {
      SetTemaAuto();
    } else if (theme == "dark") {
      console.log("entrei aqui");
      SetTemaLight();
      setcont("1");
    } else if (theme == "light") {
      SetTemaDark();
      setcont("2");
    }
    console.log(cont);
  };
  const SetTemaAuto = () => {
    let themeAuto = Appearance.getColorScheme();
    if (theme == "dark" && themeAuto == "light") {
      toggleTheme(themeAuto);
      setcont("4");
    } else if (theme == "light" && themeAuto == "dark") {
      toggleTheme(themeAuto);
      setcont("5");
    } else {
      setcont("6");
    }
  };
  const SetTemaDark = () => {
    toggleTheme("dark");
  };
  const SetTemaLight = () => {
    toggleTheme("light");
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
            {/* <Text style={styles.shopName_}>SEJA BEM-VINDO!!</Text> */}
            <View style={{ marginLeft: 25, backgroundColor: textColor2, justifyContent: "center", borderRadius: 100, height: 25 }}>
              {cont == "5" || cont == "4" || cont == "6" ? (
                <Text onPress={setTheme} style={{ paddingLeft: 7, paddingRight: 7, fontWeight: "bold" }}>
                  AUTO
                </Text>
              ) : cont == "1" ? (
                <Ionicons name="contrast-outline" size={25} color="black" onPress={setTheme} />
              ) : (
                <Ionicons name="contrast-outline" size={25} color="white" onPress={setTheme} />
              )}
            </View>
            {/* <Text style={{color:'white'}}>{theme}</Text> */}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};
export default Header;
