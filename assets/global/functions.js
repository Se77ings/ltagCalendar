import { Alert, Platform } from "react-native";
import * as SQLite from "expo-sqlite";
import Toast from "react-native-root-toast";
import * as LocalAuthentication from "expo-local-authentication";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { db } from "../../database/database";
import { ObterEstabelecimentoAsync } from "../../services/estabelecimentoService";

export const formatPhoneNumber = (input) => {
	let maskedValue = input;

	maskedValue = input.replace(/\D/g, "").slice(0, 11); // Remove não números e limita a 11 caracteres
	if (maskedValue.length == 10) {
		maskedValue = maskedValue.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
	} else if (maskedValue.length == 11) {
		maskedValue = maskedValue.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
	} else {
		maskedValue = maskedValue.replace(/\D/g, "");
	}
	return maskedValue;
};

export const exportDB = async () => {
	if (Platform.OS === "android") {
		const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
		if (permissions.granted) {
			const base64 = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "SQLite/ltagDatabase", {
				encoding: FileSystem.EncodingType.Base64,
			});

			await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, "ltagDatabase.db", "application/octet-stream")
				.then(async (uri) => {
					await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
					Toast.show("Banco de dados exportado com sucesso", {
						duration: Toast.durations.LONG,
						position: Toast.positions.BOTTOM,
						shadow: true,
						animation: true,
						hideOnPress: false,
						textColor: "white",
						backgroundColor: "green",
					});
				})
				.catch((e) => {
					// console.log(e);
					Alert.alert("Erro ao exportar o banco de dados", "Por favor, escolha outra pasta para realizar esta ação.");
				});
		} else {
			// Alert.alert("Permissão negada", "Por favor, conceda permissão para exportar o banco de dados.");
			Toast.show("Permissão negada", {
				duration: Toast.durations.LONG,
				position: Toast.positions.BOTTOM,
				shadow: true,
				animation: true,
				hideOnPress: false,
				textColor: "white",
				backgroundColor: "red",
			});
		}
	} else {
		try {
			await Sharing.shareAsync(FileSystem.documentDirectory + "SQLite/ltagDatabase");
			Toast.show("Banco de dados exportado com sucesso", {
				duration: Toast.durations.LONG,
				position: Toast.positions.BOTTOM,
				shadow: true,
				animation: true,
				hideOnPress: false,
				textColor: "white",
				backgroundColor: "green",
			});
		} catch (e) {
			// console.log(e);
			Alert.alert("Erro ao exportar o banco de dados", "Por favor, tente novamente em outro diretório.");
		}
	}
};

export const importDb = async () => {
	let result = await DocumentPicker.getDocumentAsync({
		copyToCacheDirectory: true,
	});
	console.log(result);

	if (result.canceled === false && result.assets[0].uri) {
		try {
			console.log("Começando a importação");

			const sqliteDirectory = FileSystem.documentDirectory + "SQLite";
			const databasePath = sqliteDirectory + "/ltagDatabase.db";

			// Vou mudar a validação, por que aqui sempre vai ser true... pois na primeira inicialização, ja cria o banco antes mesmo de ser possível importar um novo.
			// const directoryExists = (await FileSystem.getInfoAsync(databasePath)).exists;

			const directoryExists = ObterEstabelecimentoAsync().then((estabelecimento) => {
				if (estabelecimento.data.id) {
					return true;
				} else {
					return false;
				}
			});

			if (directoryExists) {
				Alert.alert("Atenção", "Um banco de dados já existe. Deseja substituí-lo? Os dados atuais serão perdidos.", [
					{
						text: "Cancelar",
						style: "cancel",
						onPress: () => {
							console.log("Usuário cancelou a importação.");
						},
					},
					{
						text: "Aceitar",
						onPress: async () => {
							console.log("Usuário aceitou substituir o banco de dados.");

							// Deleta o banco de dados atual
							const clearDB = await clearDatabase();
							if (!clearDB) {
								console.error("Erro ao limpar o banco de dados.");
								return;
							}
							// Continua com a importação
							await updateDatabase(result.assets[0].uri, databasePath);
						},
					},
				]);
			} else {
				console.log("Diretório não existe, criando novo.");
				// await FileSystem.makeDirectoryAsync(databasePath);
				await updateDatabase(result.assets[0].uri, databasePath);
			}
		} catch (error) {
			console.error("Erro ao importar o banco de dados:", error);
		}
	} else {
		Alert.alert("Erro ao abrir arquivo", "O arquivo selecionado é inválido ou o processo foi cancelado.");
	}
};

export const updateDatabase = async (uri, databasePath) => {
	try {
		if (!uri) {
			throw new Error("URI do arquivo não encontrada.");
		}

		const base64 = await FileSystem.readAsStringAsync(uri, {
			encoding: FileSystem.EncodingType.Base64,
		});
		console.log("Base64 lido com sucesso");

		await FileSystem.writeAsStringAsync(databasePath, base64, {
			encoding: FileSystem.EncodingType.Base64,
		});

		console.log("Banco de dados importado e aberto com sucesso!");

		Toast.show("Banco de dados importado com sucesso", {
			duration: Toast.durations.LONG,
			position: Toast.positions.BOTTOM,
			shadow: true,
			animation: true,
			hideOnPress: false,
			textColor: "white",
			backgroundColor: "green",
		});
	} catch (error) {
		console.error("Erro ao abrir o banco de dados:", error);
	}
};

export const clearDatabase = async () => {
	console.log("Limpando db... recebi o nome do banco:", "ltagDatabase.db");

	try {
		// const db = await SQLite.openDatabaseAsync("ltagDatabase", { useNewConnection: true });
		await db.closeAsync();

		await SQLite.deleteDatabaseAsync("ltagDatabase");

		console.log("Banco de dados excluído com sucesso usando SQLite.deleteDatabaseAsync.");
		return true;
	} catch (error) {
		console.error("Erro ao excluir o banco de dados:", error);
		return false;
	}
};
