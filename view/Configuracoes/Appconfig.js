import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, Button, ScrollView, FlatList, StyleSheet, Alert, Animated, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DropdownSelector from "../../assets/components/DropdownSelector";
import { useTheme } from "../../ThemeContext";
import { ObterServicosPorColaborador, ObterServicosPorFavorito, VincularServicoColaborador } from "../../database/servicoRepository";
import adicionarColaborador, { AtualizarColaboradorAsync, ObterTodosColaboradoresComServicosAsync, RemoverColaboradorAsync } from "../../services/colaboradorService";
import * as LocalAuthentication from "expo-local-authentication";

const AppConfig = () => {
	const { theme, toggleTheme } = useTheme();
	const headerStyles = theme === "dark" ? styles.darkHeader : styles.lightHeader;
	const textColor = theme === "dark" ? "white" : "white";
	const textColor2 = theme === "dark" ? "white" : "black";
	const FundoThema = theme === "dark" ? "#020C2A" : "red";

	const exportDB = async () => {
		const res = await LocalAuthentication.authenticateAsync();
		console.log(res);
		if (res.success) {
			console.log("Autenticado");
		} else {
			console.log("Não autenticado");
		}
	};

	return (
		<>
			<View>
				<View contentContainerStyle={styles.container}>
					<View style={styles.childContainer}>
						<Text>Escolher entre opções de tema</Text>
						<TouchableOpacity
							style={[styles.button, { backgroundColor: "#2F407A" }]}
							onPress={() => Alert.alert("nada ainda")}>
							<Text>Alterar Tema</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.childContainer}>
						<Text>Banco de Dados</Text>
						<TouchableOpacity
							style={[styles.button, { backgroundColor: "#2F407A" }]}
							onPress={exportDB}>
							<Text>Exportar Banco de Dados</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.button, { backgroundColor: "#2F407A" }]}>
							<Text>Importar Banco de Dados</Text>
						</TouchableOpacity>
					</View>
					<View>
						<Text>Reiniciar configurações de Fábricas</Text>
						<TouchableOpacity style={[styles.button, { backgroundColor: "#2F407A" }]}>
							<Text>Limpar Banco de Dados</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</>
	);
};
const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		justifyContent: "flex-start",
		paddingTop: 0,
		backgroundColor: "white",
	},
	ServicosCard: {
		borderWidth: 1,
		marginVertical: 7,
		borderColor: "#312fbf",
		borderRadius: 10,
		padding: 20,
		width: "100%",
	},
	Header: {
		width: "100%",
		alignItems: "center",
	},
	childContainer: {
		padding: 15,
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
		borderWidth: 1, 
	},
	label: {
		fontSize: 16,
		marginBottom: 8,
		color: "#312fbf",
	},
	button: {
		borderRadius: 10,
		padding: 10,
		alignItems: "center",
		marginTop: 10,
	},
	labelStyle: {
		paddingHorizontal: 10,
		borderRadius: 15,
		marginLeft: 5,
		paddingBottom: 8,
	},
	inputContainerStyle: {
		marginBottom: 10,
		height: 50,
	},
	input: {
		height: 50,
		color: "#333",

		fontSize: 15,
		paddingHorizontal: 10,
		borderRadius: 5,
		backgroundColor: "#F3F4F6",
	},
	textArea: {
		height: 50,
		borderColor: "#ced4da",
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		marginBottom: 5,
		backgroundColor: "#F3F4F6",
	},
	gridTitle: {
		fontSize: 20,
		margin: 0,
		fontWeight: "bold",
		color: "#312fbf",
	},
	gridContainer: {
		paddingHorizontal: 20,
	},
	colaboradorCard: {
		padding: 15,
		borderWidth: 1,
		marginTop: 15,
		borderColor: "#312fbf",
		borderRadius: 10,
		padding: 20,
		width: "100%",
		backgroundColor: "#F3F4F6",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 3,
	},
	colaboradorNome: {
		fontWeight: "bold",
		fontSize: 16,
		color: "#14213b",
	},
	colaboradorServico: {
		color: "#555",
		fontSize: 14,
		marginLeft: 5,
	},
	colaboradorDescricao: {
		color: "#777",
		fontSize: 14,
	},
	closeButton: {
		position: "absolute",
		top: 10, // Distância do topo
		right: 10, // Distância da direita
		zIndex: 1,
		backgroundColor: "#666699",
		borderRadius: 15,
		padding: 0,
	},
	submitButton: {
		backgroundColor: "#312fbf",
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: "center",
		marginTop: 20,
	},
	submitButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
});
export default AppConfig;
