import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, Modal, Pressable, useColorScheme, Appearance } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "./ThemeContext";
import { NavigationContainer, useNavigation, DefaultTheme, DarkTheme } from "@react-navigation/native";
import Main from "./view/Home/Home";
import Config from "./view/Configuracoes/Config";
import { TourGuideProvider, TourGuideZone } from "rn-tourguide";
import { SafeAreaView } from "react-native-safe-area-context";

function App() {
  var padrao = useColorScheme();
  let teste = "dark";
  const { theme, toggleTheme } = useTheme(); // Consumindo o contexto

  // const styles = theme === 'dark' ? darkStyles : lightStyles;

  const Tab = createBottomTabNavigator();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="black" />
      <TourGuideProvider
        preventOutsideInteraction={true}
        {...{
          labels: {
            previous: "Anterior",
            next: "Próximo passo",
            skip: "Pular tutorial",
            finish: "Finalizar",
          },
        }}>
        <NavigationContainer theme={theme === "dark" ? DarkTheme : DefaultTheme}>
          <Tab.Navigator
            initialRouteName="Main"
            screenOptions={{
              tabBarStyle: {
                backgroundColor: "#001a66",
                padding: 2,
                height: 60,
                borderTopEndRadius: 50,
                borderTopLeftRadius: 50,
              },
              tabBarActiveTintColor: "white", // Cor ícone ativo
              tabBarInactiveTintColor: "#9c9c9c", // Cinza ícone inativo
              lazy: false,
            }}>
            <Tab.Screen
              name="Main"
              component={Main}
              options={{
                headerShown: false,
                tabBarLabel: "Início",
                tabBarLabelStyle: { fontSize: 12, color: "white" },
                tabBarIcon: (
                  { color } // Usa o color fornecido pelo Navigator
                ) => (
                  <View style={[styles.iconDiv, { borderColor: color }]}>
                    <Ionicons name="home" color={color} size={22} />
                  </View>
                ),
              }}
            />
            <Tab.Screen
              name="Configurações"
              component={Config}
              options={{
                headerShown: false,
                tabBarLabel: "Configurações",
                tabBarLabelStyle: { fontSize: 12, color: "white" },
                tabBarIcon: (
                  { color } // Usa o color fornecido pelo Navigator
                ) => (
                  <View style={[styles.iconDiv, { borderColor: color }]}>
                    <Ionicons name="settings" color={color} size={22} />
                  </View>
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </TourGuideProvider>
    </SafeAreaView>
  );
}

export default function AppWrapper() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  iconDiv: {
    borderWidth: 1.5,
    borderColor: "white",
    borderRadius: 50,
    padding: 5,
    height: 36,
    marginTop: 5,
    alignSelf: "center",
  },
});

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  text: {
    fontSize: 18,
    color: "black",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#0045a0",
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
  },
});

// Estilos para o tema escuro
const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#BB86FC",
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
  },
});
