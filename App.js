import React, { useEffect, useState } from "react";
import { Text, View, Button, TouchableOpacity, Modal, Pressable, useColorScheme, Appearance } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import styles from "./assets/styles/styles";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "./ThemeContext";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import Main from "./view/Home/Home";
import Config from "./view/Configuracoes/Config";
import { TourGuideProvider, TourGuideZone } from "rn-tourguide";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootSiblingParent } from 'react-native-root-siblings';
import ListaClientes from "./view/Configuracoes/Clientes";

function App() {
	const { theme, toggleTheme } = useTheme(); // Consumindo o contexto
	const Tab = createBottomTabNavigator();
	const { themeAuto, togglethemeAuto } = useTheme();


	const DarkTheme = {
		dark: true,
		colors: {
		  primary: 'rgb(10, 132, 255)',
		  background: '#020C2A',
		  card: 'rgb(18, 18, 18)',
		  text: 'rgb(229, 229, 231)',
		  border: 'rgb(39, 39, 41)',
		  notification: 'rgb(255, 69, 58)',
		},
	  };

	  const DefaultTheme = {
		dark: false,
		colors: {
		  primary: 'rgb(0, 122, 255)',
		  background: 'rgb(242, 242, 242)',
		  card: 'rgb(255, 255, 255)',
		  text: 'rgb(28, 28, 30)',
		  border: 'rgb(216, 216, 216)',
		  notification: 'rgb(255, 59, 48)',
		},
	  };

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<StatusBar
				style="light"
				backgroundColor="black"
			/>
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
				<NavigationContainer theme={theme === "dark"
					? DarkTheme
					: theme === "ligth"
					? DefaultTheme
					: themeAuto}>
					<Tab.Navigator
						initialRouteName="Main"
						screenOptions={{ tabBarStyle: { backgroundColor: "#001a66", padding: 2, height: 60}, lazy: false }}>
							<Tab.Screen
							name="Relatorios"
							component={ListaClientes}
							options={{
								headerShown: false,
								tabBarLabel: "Relatórios",
								tabBarLabelStyle: { fontSize: 12, color: "white" },
								tabBarIcon: (
									{ color } // Usa o color fornecido pelo Navigator
								) => (
									<View style={[styles.iconDiv, { borderColor: color }]}>
										<Ionicons
											name="document-text"
											color={"white"}
											size={22}
										/>
									</View>
								),
							}}>

							</Tab.Screen>
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
										<Ionicons
											name="home"
											color={"white"}
											size={22}
										/>
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
										<Ionicons
											name="settings"
											color={'white'}
											size={22}
										/>
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
			<RootSiblingParent>
				<App />
			</RootSiblingParent>
		</ThemeProvider>
	);
}
