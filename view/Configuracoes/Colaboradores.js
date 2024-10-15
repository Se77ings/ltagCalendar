import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, Button, ScrollView, FlatList, StyleSheet, Alert, Animated, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Se estiver usando Expo, ou outro ícone de sua escolha
import { FloatingLabelInput } from "react-native-floating-label-input";
import DropdownSelector from "../../assets/components/DropdownSelector";
import { ObterServicosPorColaborador, ObterServicosPorFavorito, VincularServicoColaborador } from "../../database/servicoRepository";
import CriarColaborador, { ObterColaboradores } from "../../database/colaboradorRepository";

const Colaboradores = () => {
	const [nome, setNome] = useState("");
	const [todosServicos, setTodosServicos] = useState("");
	const [colaboradores, setColaboradores] = useState([]);
	const [servicosSelecionados, setServicosSelecionados] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [update, setUpdate] = useState(false);
	const formAnimation = useRef(new Animated.Value(0)).current; // Inicializa o valor da animação

	const handleSubmit = async () => {
		let id = "";
		await CriarColaborador({ nome: nome }).then((result) => {
			id = result;
		});

		// VincularServicoColaborador({ servicoId: servicosSelecionados, colaboradorId: id, afinidade: 1 });
		servicosSelecionados.forEach((servico) => {
			VincularServicoColaborador({ servicoId: servico, colaboradorId: id, afinidade: 1 });
		});

		setNome("");
		setServicosSelecionados([]);
		setUpdate(true);
	};

	useEffect(() => {
		setUpdate(true);
	}, []);

	useEffect(() => {
		ObterServicosPorFavorito().then((result) => {
			setTodosServicos(result);
		});
		ObterColaboradores().then((result) => {
			setColaboradores(result);
		});
		setUpdate(false);
	}, [update]);

	useEffect(() => {
		if (showForm) {
			Animated.timing(formAnimation, {
				toValue: 1,
				duration: 300,
				useNativeDriver: false,
			}).start();
		} else {
			Animated.timing(formAnimation, {
				toValue: 0,
				duration: 300,
				useNativeDriver: false,
			}).start();
		}
	}, [showForm]);

	const renderColaborador = ({ item }) => {
		return (
			<Pressable
				style={styles.colaboradorCard}
				onPress={async () => {
          

					setNome(item.Nome);
					var servicos = await ObterServicosPorColaborador(item.id);
					console.log(servicos);
					setServicosSelecionados(servicos);
					setShowForm(true);
				}}>
				<View>
					<Text style={styles.colaboradorNome}>{item.Nome}</Text>
					<Text style={styles.colaboradorDescricao}>{item.descricao}</Text>
				</View>
				<View style={{ alignItems: "center" }}>
					<Text style={{ fontSize: 12, color: "#276000" }}>Clique para editar</Text>
				</View>
			</Pressable>
		);
	};
	const toggleForm = (opt) => {
		if (opt == "close") return setShowForm(false);
		if (showForm) {
			//Salvando Colaborador novo
			if (nome === "") {
				Alert.alert("Atenção", "Nome do colaborador não pode ser vazio");
				return;
			}
			if (servicosSelecionados.length === 0) {
				Alert.alert("Atenção", "Selecione ao menos um serviço");
				return;
			}

			handleSubmit();
		}
		setShowForm(!showForm);
	};

	const formHeight = formAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 250],
	});

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<Animated.View style={{ width: "90%", height: formHeight, overflow: "hidden" }}>
					{showForm && (
						<View style={{ borderWidth: 0, borderColor: "#666699", borderRadius: 20, padding: 20, backgroundColor: "#c2c2d6", marginBottom: 15 }}>
							<TouchableOpacity
								style={styles.closeButton}
								onPress={() => toggleForm("close")}>
								<Ionicons
									name="close"
									size={24}
									color="#fff"
								/>
							</TouchableOpacity>
							<Text style={[styles.label, { textAlign: "center" }]}>Adicionar novo</Text>
							<FloatingLabelInput
								labelStyles={styles.labelStyle}
								inputStyles={styles.input}
								onChangeText={setNome}
								containerStyles={styles.inputContainerStyle}
								value={nome}
								label="Nome do Colaborador"
								keyboardType="default"
							/>
							{/* 
							<Text style={styles.label}>Nome do Colaborador:</Text>
							<TextInput
								style={styles.input}
								value={colaborador.nome}
								onChangeText={setNome}
								placeholder="Insira o nome do serviço"
							/> */}

							{/* <Text style={styles.label}>Descrição:</Text>
							<TextInput
								style={styles.textArea}
								value={colaborador.descricao}
								onChangeText={setDescricao}
								placeholder="Insira a descrição do serviço"
								multiline
								numberOfLines={4}
							/> */}
							<Text>Selecione os serviços do colaborador:</Text>
							<DropdownSelector
								lista={todosServicos}
								label={"Serviço(s)"}
								icone={"briefcase-outline"}
								callbackSelecionados={setServicosSelecionados}
								selectedItems={servicosSelecionados}
							/>
						</View>
					)}
				</Animated.View>

				<Text style={styles.gridTitle}>Colaboradores Cadastrados:</Text>
				{colaboradores && colaboradores.length > 0 ? (
					<FlatList
						scrollEnabled={false}
						data={colaboradores}
						renderItem={renderColaborador}
						keyExtractor={(item) => item.id.toString()}
						contentContainerStyle={styles.gridContainer}
						style={{ width: "90%", backgroundColor: "#a3a3c2", borderRadius: 15 }}
					/>
				) : (
					<View style={{ width: "90%", backgroundColor: "#a3a3c2", borderRadius: 15, flex: 1, justifyContent: "center" }}>
						<Text style={{ textAlign: "center" }}>Nenhum colaborador cadastrado</Text>
						{!showForm && <Text style={{ textAlign: "center" }}>Clique no botão abaixo para Cadastrar</Text>}
					</View>
				)}
			</ScrollView >
			<View style={{ margin: "auto", marginBottom: 10, width: "84%" }}>
				<TouchableOpacity
					style={{
						backgroundColor: "#3d3d5c",
						borderRadius: 10,
						padding: 10,
						alignItems: "center",
					}}
					onPress={toggleForm}>
					<Text style={{ color: "white" }}>{showForm ? "Salvar" : "Cadastrar Novo"}</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-start",
		paddingTop: 0,
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
	Header: {
		width: "100%",
		alignItems: "center",
	},
	scrollContainer: {
		padding: 15,
		justifyContent: "center",
		alignItems: "center",
		// height: "100%",
	},
	label: {
		fontSize: 16,
		marginBottom: 8,
		color: "#666699",
	},
	// input: {
	// 	borderRadius: 5,
	// 	paddingHorizontal: 10,
	// 	backgroundColor: "#fff",
	// 	// marginBottom:50
	// },

	labelStyle: {
		backgroundColor: "white",
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
		// textAlign: "center",
		height: 50,
		color: "black",
		fontSize: 20,
		// borderColor: "black",
		// borderWidth: 1,
		// marginBottom: 10,
		paddingHorizontal: 10,
		borderRadius: 5,
		backgroundColor: "#fff",
	},
	textArea: {
		height: 50,
		borderColor: "#ced4da",
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		marginBottom: 5,
		backgroundColor: "#fff",
	},
	gridTitle: {
		fontSize: 20,
		margin: 0,
		fontWeight: "bold",
		color: "#666699",
	},
	gridContainer: {
		paddingHorizontal: 20,
	},
	colaboradorCard: {
		padding: 15,
		borderWidth: 1,
		marginTop: 15,
		borderColor: "#666699",
		borderRadius: 10,
		padding: 20,
		width: "100%",
		backgroundColor: "#e0e0eb",
	},
	colaboradorNome: {
		fontWeight: "bold",
		fontSize: 16,
	},
	colaboradorDescricao: {
		color: "#555",
	},
});

export default Colaboradores;
