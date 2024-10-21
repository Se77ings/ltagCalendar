import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, Button, ScrollView, FlatList, StyleSheet, Alert, Animated, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Se estiver usando Expo, ou outro ícone de sua escolha
import { StatusBar } from "expo-status-bar";
import { FloatingLabelInput } from "react-native-floating-label-input";
import DropdownSelector from "../../assets/components/DropdownSelector";
import { ObterServicosPorColaborador, ObterServicosPorFavorito, VincularServicoColaborador } from "../../database/servicoRepository";
import adicionarColaborador, { AtualizarColaboradorAsync, ObterTodosColaboradoresComServicosAsync, RemoverColaboradorAsync } from "../../services/colaboradorService";

const Colaboradores = () => {
	const [nome, setNome] = useState("");
	const [todosServicos, setTodosServicos] = useState("");
	const [colaboradores, setColaboradores] = useState([]);
	const [servicosSelecionados, setServicosSelecionados] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [update, setUpdate] = useState(false);
	const [editing, setEditing] = useState(false);
	const [formHeight, setFormHeight] = useState(0);
	const [animatedHeight] = useState(new Animated.Value(0));

	const handleSubmit = async () => {
		let id = colaboradorSelecionado ? colaboradorSelecionado.id : "";
		if (editing) {
			await AtualizarColaboradorAsync({ id, nome, servicos: servicosSelecionados });
		} else {
			await adicionarColaborador({ nome: nome, servicos: servicosSelecionados }).then((result) => {
				id = result;
			});
		}

		setNome("");
		setServicosSelecionados([]);
		setEditing(false);
		setShowForm(false);
		setUpdate(true);
	};

	useEffect(() => {
		setUpdate(true);
	}, []);

	useEffect(() => {
		ObterTodosColaboradoresComServicosAsync().then((result) => {
			setColaboradores(result.data);
		});

		ObterServicosPorFavorito().then((result) => {
			setTodosServicos(result);
		});

		setUpdate(false);
	}, [update]);
	const [colaboradorSelecionado, setColaboradorSelecionado] = useState(null);

	const renderColaborador = ({ item }) => {
		return (
			<Pressable
				style={styles.colaboradorCard}
				onPress={() => {
					if (editing) {
						setEditing(false);
						setServicosSelecionados([]);
						setShowForm(false);
						setTimeout(() => {
							setEditing(true);
							setNome(item.Nome);
							setServicosSelecionados(item.servicos || []);
							setShowForm(true);
						}, 0);
					} else {
						setColaboradorSelecionado(item);
						setNome(item.Nome);
						setServicosSelecionados(item.servicos || []);
						setShowForm(true);
						setEditing(true);
					}
				}}>
				<View>
					<Text style={styles.colaboradorNome}>{item.Nome}</Text>
					<View style={{ marginVertical: 5 }}>
						{item.servicos && item.servicos.length > 0 ? (
							item.servicos.map((servico, index) => (
								<Text
									key={index}
									style={styles.colaboradorServico}>
									{servico.Nome}
								</Text>
							))
						) : (
							<Text style={styles.colaboradorDescricao}>Nenhum serviço vinculado</Text>
						)}
					</View>
				</View>
				<View style={{ alignItems: "center" }}>
					<Text style={{ fontSize: 12, color: "#276000" }}>Clique para editar</Text>
				</View>
			</Pressable>
		);
	};
	const toggleForm = (opt) => {
		if (opt == "close") {
			setNome("");
			setServicosSelecionados([]);
			setEditing(false);
			return setShowForm(false);
		}
		if (showForm) {
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

	const handleLayout = (event) => {
		const { height } = event.nativeEvent.layout;
		setFormHeight(height);
	};

	useEffect(() => {
		if (showForm) {
			Animated.timing(animatedHeight, {
				toValue: formHeight,
				duration: 300,
				useNativeDriver: false,
			}).start();
		} else {
			Animated.timing(animatedHeight, {
				toValue: 0,
				duration: 300,
				useNativeDriver: false,
			}).start();
		}
	}, [showForm, formHeight]);

	const handleDelete = (id) => {
		
		Alert.alert(
			"Excluir Colaborador",
			"Tem certeza que deseja excluir este colaborador?\n os serviços vinculados a ele ficarão sem vínculo",
			[
				{
					text: "Cancelar",
					onPress: () => {},
					style: "cancel",
				},
				{
					text: "Confirmar",
					onPress: () => {
						RemoverColaboradorAsync(id).then((result) => {
							if (result.success) {
							} else {
								Alert.alert("Erro", result.error);
							}
							setShowForm(false);
							setNome("");
							setServicosSelecionados([]);
							setUpdate(true);
						});
					},
				},
			],
			{ cancelable: false }
		);
	};
	return (
		<>
			<StatusBar style="dark" />
			<ScrollView contentContainerStyle={styles.container}>
				<View style={styles.scrollContainer}>
					<Animated.View style={{ width: "90%", height: animatedHeight, overflow: "hidden" }}>
						{showForm && (
							<View
								onLayout={handleLayout}
								style={{ minHeight: 220, borderWidth: 0, borderColor: "#666699", borderRadius: 20, padding: 20, backgroundColor: "#c2c2d6", marginBottom: 15 }}>
								<TouchableOpacity
									style={styles.closeButton}
									onPress={() => toggleForm("close")}>
									<Ionicons
										name="close"
										size={24}
										color="#fff"
									/>
								</TouchableOpacity>
								<Text style={[styles.label, { textAlign: "center" }]}>{editing ? "Editando" : "Cadastrar Novo"}</Text>
								<FloatingLabelInput
									labelStyles={styles.labelStyle}
									inputStyles={styles.input}
									onChangeText={setNome}
									containerStyles={styles.inputContainerStyle}
									value={nome}
									label="Nome do Colaborador"
									keyboardType="default"
								/>
								<Text>Selecione os serviços do colaborador:</Text>
								<DropdownSelector
									lista={todosServicos}
									label={"Serviço(s)"}
									icone={"briefcase-outline"}
									callbackSelecionados={setServicosSelecionados}
									selectedItems={servicosSelecionados}
									opt={"servico"}
								/>
								{editing && (
									<TouchableOpacity
										onPress={() => {
											handleDelete(colaboradorSelecionado.id);
										}}>
										<Ionicons
											name="trash-outline"
											size={24}
											color="#312fbf"
											style={{ position: "absolute", bottom: 10, right: 10 }}
										/>
									</TouchableOpacity>
								)}
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
							style={{ width: "90%", backgroundColor: "#a3a3c2", borderRadius: 15, paddingBottom: 15 }}
						/>
					) : (
						<View style={{ width: "90%", backgroundColor: "#a3a3c2", borderRadius: 15, flexGrow: 1, justifyContent: "center" }}>
							<Text style={{ textAlign: "center" }}>Nenhum colaborador cadastrado</Text>
							{!showForm && <Text style={{ textAlign: "center" }}>Clique no botão abaixo para Cadastrar</Text>}
						</View>
					)}
				</View>
			</ScrollView>
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
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		justifyContent: "flex-start",
		paddingTop: 0,
		backgroundColor: "#f8f9fa",
	},

	Header: {
		width: "100%",
		alignItems: "center",
	},
	scrollContainer: {
		padding: 15,
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
	},
	label: {
		fontSize: 16,
		marginBottom: 8,
		color: "#312fbf", // Nova co
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

		fontSize: 20,
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
		top: 10,
		right: 10,
		zIndex: 1,
		backgroundColor: "#312fbf",
		borderRadius: 15,
		padding: 5,
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

export default Colaboradores;
