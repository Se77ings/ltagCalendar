import React, { useEffect, useState } from "react";
import { Text, View, Button, TouchableOpacity, Modal, Pressable, useColorScheme, Appearance } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import styles from "./assets/styles/styles";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "./ThemeContext";
import { NavigationContainer, useNavigation, DefaultTheme, DarkTheme } from "@react-navigation/native";
import Main from "./view/Home/Home";
import Config from "./view/Configuracoes/Config";
import { TourGuideProvider } from "rn-tourguide";
import { SafeAreaView } from "react-native-safe-area-context";

function App() {
  const { theme, toggleTheme } = useTheme(); // Consumindo o contexto
  const Tab = createBottomTabNavigator();

  return (
    <SafeAreaView style={{ flex: 1}}>
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
          <Tab.Navigator initialRouteName="Main" screenOptions={{ tabBarStyle: { backgroundColor: "#001a66", padding: 2, height: 60} }}>
            <Tab.Screen
              name="Main"
              component={Main}
              options={{
                headerShown: false,
                // headerShown: true,
                // headerTitle: () => <Header />,
                tabBarLabel: "Início",
                tabBarLabelStyle: { fontSize: 12, color: "white" },
                tabBarIcon: () => (
                  <View style={styles.iconDiv}>
                    <Ionicons name="home" color={"white"} size={22} />
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
                tabBarIcon: () => (
                  <View style={styles.iconDiv}>
                    <Ionicons name="settings" color={"white"} size={22} />
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