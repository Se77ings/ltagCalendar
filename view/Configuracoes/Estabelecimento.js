import React, { useState, useEffect, useRef } from "react";
import { View, Text, Switch, TouchableOpacity, TextInput, Pressable, ScrollView, FlatList, StyleSheet, Alert, Image, Button, DeviceEventEmitter, ActivityIndicator } from "react-native";
import { useNavigation, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeContext"; // Usando o hook useTheme para acessar o estado do tema
import adicionarServico, { AtualizarServicoAsync, DesabilitarServicoAsync, ExisteAtendimentoComServicoAsync, ExisteServicoComColaboradorAsync, ObterTodosServicosAsync, ObterTodosServicosAtivosAsync, RemoverServicoAsync } from "../../services/servicoService";
import { AtualizarEstabelecimentoAsync, ObterEstabelecimentoAsync } from "../../services/estabelecimentoService";
import icon from "../../assets/icon.png";
import * as ImagePicker from "expo-image-picker";
import { formatPhoneNumber } from "../../assets/global/functions";
import Toast from "react-native-root-toast";

const Estabelecimento = () => {
	const [editar, setEditar] = useState(false);
	const [loading, setLoading] = useState(false);
	const [estabelecimento, setEstabelecimento] = useState({
		id: "",
		Nome: "",
		Telefone: "",
		Endereco: "",
		Logo: "",
	});
	const [erro, setErro] = useState({
		nome: false,
		telefone: false,
	});
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

	useEffect(() => {
		ObterEstabelecimentoAsync().then((response) => {
			if (response.success) {
				setEstabelecimento({ Nome: response.data.Nome, Telefone: formatPhoneNumber(response.data.Telefone), Endereco: response.data.Endereco, Logo: response.data.Logo, id: response.data.id });
				// setEstabelecimento(response.data);
			} else {
				console.error("Erro ao obter Estabelecimento:", response.error);
			}
		});
	}, []);
	const pickImage = async () => {
		setLoading(true);
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			base64: true,
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});
		setLoading(false);

		if (!result.canceled) {
			// setImage(JSON.stringify(result.assets[0]));
			setEstabelecimento({ ...estabelecimento, Logo: JSON.stringify(result.assets[0]) });
			handleChangeImage(JSON.stringify(result.assets[0]));
		}
	};

	const handleSalvar = async () => {
		if (estabelecimento.Nome === "" || estabelecimento.Telefone === "") {
			// Alert.alert("Atenção", "Nome e telefone são obrigatórios"); // depois mudar esse Alert
			setErro({ nome: "Nome é obrigatório", telefone: "Telefone é obrigatório" });
			setTimeout(() => {
				setErro({ nome: false, telefone: false });
			}, 3000);
			return;
		}

		if (estabelecimento.Telefone.length < 14 || estabelecimento.Telefone.length > 15) {
			setErro({ ...erro, telefone: "Telefone Inválido" });

			setTimeout(() => {
				setErro({ ...erro, telefone: false });
			}, 3000);
		}

		let formSend = {
			id: estabelecimento.id,
			nome: estabelecimento.Nome,
			telefone: estabelecimento.Telefone.replace(/\D/g, ""),
			endereco: estabelecimento.Endereco,
			logo: estabelecimento.Logo,
		};

		const result = await AtualizarEstabelecimentoAsync(formSend);
		if (result.success) {
			Toast.show("Dados cadastrados com sucesso", {
				duration: Toast.durations.LONG,
				position: Toast.positions.BOTTOM,
				shadow: true,
				animation: true,
				hideOnPress: false,
			});

			DeviceEventEmitter.emit("atualizarEstabelecimento");
			setEditar(false);
			return;
		} else {
			Alert.alert("Erro", result.error);
		}
	};

	const handleChangeImage = async (image = null) => {
		let formSend = {
			id: estabelecimento.id,
			nome: estabelecimento.Nome,
			telefone: estabelecimento.Telefone.replace(/\D/g, ""),
			endereco: estabelecimento.Endereco,
			logo: image,
		};

		const result = await AtualizarEstabelecimentoAsync(formSend);
		if (result.success) {
			Toast.show("Imagem alterada com sucesso!", {
				duration: Toast.durations.LONG,
				position: Toast.positions.CENTER,
				shadow: true,
				animation: true,
				hideOnPress: false,
			});
			DeviceEventEmitter.emit("atualizarEstabelecimento");

			setEditar(false);

			return;
		} else {
			Alert.alert("Erro", result.error);
		}
	};

	return (
		<View contentContainerStyle={styles.container}>
			{loading && (
				<View style={{ position: "absolute", zIndex: 1, backgroundColor: "rgba(255,255,255,0.8)", justifyContent: "center", alignSelf: "center", height: "100%", width: "100%", borderRadius: 0 }}>
					<ActivityIndicator
						size="large"
						color="#0000ff"
					/>
				</View>
			)}
			<View style={styles.scrollContainer}>
				<Image
					source={getLogoSource()}
					style={styles.logo}
				/>
				{editar && (
					<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
						<View style={{ width: "50%", margin: 10 }}>
							<Button
								color={"#666699"}
								style={styles.button}
								title="Alterar Imagem"
								onPress={pickImage}
							/>
						</View>
						<View style={{ width: "50%", margin: 10 }}>
							<Button
								color={"red"}
								style={styles.button}
								title="Remover Imagem"
								onPress={() => {
									Alert.alert("Remover Imagem", "Deseja realmente remover a imagem?", [
										{
											text: "Sim",
											onPress: () => {
												// nada ainda, preciso primeiro fazer o edit.
												handleChangeImage();
												setEstabelecimento({ ...estabelecimento, Logo: "" });
												// DeviceEventEmitter.emit("atualizarEstabelecimento", { Logo: "" });
											},
										},
										{
											text: "Não",
											onPress: () => {},
										},
									]);
								}}
							/>
						</View>
					</View>
				)}
				<View style={{ width: "80%" }}>
					<View style={{ flexDirection: "column" }}>
						<Text style={styles.label}>Nome </Text>
						<TextInput
							style={styles.input}
							value={estabelecimento.Nome}
							editable={editar}
							onChangeText={(value) => setEstabelecimento({ ...estabelecimento, Nome: value })}
						/>
						{erro.nome && <Text style={styles.error}>{erro.nome}</Text>}
					</View>
					<View style={{ flexDirection: "column" }}>
						<Text style={styles.label}>Telefone </Text>
						<TextInput
							style={styles.input}
							value={estabelecimento.Telefone}
							editable={editar}
							//formatPhoneNumber
							onChangeText={(value) => setEstabelecimento({ ...estabelecimento, Telefone: formatPhoneNumber(value) })}
						/>
						{erro.telefone && <Text style={styles.error}>{erro.telefone}</Text>}
					</View>
					<View style={{ flexDirection: "column" }}>
						<Text style={styles.label}>Endereço </Text>
						<TextInput
							style={styles.input}
							value={estabelecimento.Endereco}
							editable={editar}
							onChangeText={(value) => setEstabelecimento({ ...estabelecimento, Endereco: value })}
						/>
					</View>
				</View>

				<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
					<View style={{ width: "35%", margin: 5 }}>
						<Button
							color={"#666699"}
							style={styles.button}
							title="Editar"
							onPress={() => {
								setEditar(!editar);
							}}
						/>
					</View>
					<View style={{ width: "35%", margin: 5 }}>
						<Button
							disabled={!editar}
							color={"green"}
							style={styles.button}
							title="Salvar"
							onPress={handleSalvar}
						/>
					</View>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: "flex-start",
		paddingTop: 0,
		backgroundColor: "white", // Nova cor de fundo
	},
	switchContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 0,
	},
	logo: {
		width: 150,
		height: 150,
		borderRadius: 100,
	},
	buton: {
		backgroundColor: "#666699",
		borderRadius: 15,
		padding: 0,
		margin: 10,
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
		fontSize: 18,
		color: "#312fbf", // Nova cor
	},
	content: {
		fontSize: 20,
		color: "#666699",
	},
	input: {
		fontSize: 20,
		width: "100%",
		height: 50,
		borderColor: "#ced4da",
		borderRadius: 5,
		paddingHorizontal: 10,
		marginBottom: 2,
		backgroundColor: "#fff",
	},
	textArea: {
		height: 50,
		borderColor: "#ced4da",
		borderRadius: 5,
		paddingHorizontal: 10,
		marginBottom: 5,
		backgroundColor: "#fff",
	},
	error: {
		color: "red",
		marginBottom: 2,
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
	ServicosCard: {
		padding: 15,
		borderWidth: 1,
		marginVertical: 7,
		borderColor: "#312fbf",
		borderRadius: 10,
		padding: 20,
		width: "100%",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 3,
	},
	ServicosCardDesabilitado: {
		padding: 15,
		borderWidth: 1,
		marginVertical: 15,
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
	ServicosNome: {
		ffontWeight: "bold",
		fontSize: 16,
		color: "#14213b",
	},
	ServicosNomeDesabilitado: {
		ffontWeight: "bold",
		fontSize: 16,
		color: "red",
	},
});
export default Estabelecimento;
