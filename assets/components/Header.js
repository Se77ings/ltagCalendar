import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, Modal, Pressable, Button, InteractionManager, Appearance } from "react-native";
import styles from "../styles/styles";
import icon from "../../assets/icon.png";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../ThemeContext"; // Usando o hook useTheme para acessar o estado do tema


const Header = ({ title }) => {
  const { theme, toggleTheme } = useTheme();

  // Estilos baseados no tema atual
  const headerStyles = theme === "dark" ? styles.darkHeader : styles.lightHeader;
  const textColor = theme === "dark" ? "white" : "black";
  const ToggleThema = () => {
    toggleTheme();
  }
  
  return (
    <View>
      <LinearGradient colors={["#000000", "#0055c6"]} start={{ x: 0.5, y: 0.2 }} style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Image source={icon} style={styles.logo} />
          <View style={{flex:1,flexDirection:"row", justifyContent:"space-around"}}>
            <View>
              <Text style={styles.shopName}>LTAG CALENDAR</Text>
              <Text style={styles.shopName_}>{title}</Text>
            </View>
            {/* <Text style={styles.shopName_}>SEJA BEM-VINDO!!</Text> */}
            <View style={{marginLeft:25}}>

            <Ionicons name="contrast-outline" size={25} color="white" onPress={ToggleThema} />
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};
// const styles = StyleSheet.create({
//   lightHeader: {
//     padding: 15,
//     backgroundColor: "#f0f0f0",
//     justifyContent: "center",
//     alignItems: "center",
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   darkHeader: {
//     padding: 15,
//     backgroundColor: "#333",
//     justifyContent: "center",
//     alignItems: "center",
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
// });
export default Header;
