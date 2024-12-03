import { Alert, Platform } from "react-native";
import * as SQLite from "expo-sqlite";
import Toast from "react-native-root-toast";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { getDatabaseInstance, initialize } from "../../database/database";

const db = getDatabaseInstance();

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

const showToast = (message, type = "success") => {
  const backgroundColor = type === "success" ? "green" : "red";
  Toast.show(message, {
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: false,
    textColor: "white",
    backgroundColor,
  });
};

// export const exportDB = async () => {
//   if (Platform.OS === "android") {
//     const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
//     if (permissions.granted) {
//       const base64 = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "SQLite/ltagDatabase", {
//         encoding: FileSystem.EncodingType.Base64,
//       });

//       await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, "ltagDatabase.db", "application/octet-stream")
//         .then(async (uri) => {
//           await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });

//           showToast("Banco de dados exportado com sucesso", "success");
//         })
//         .catch((e) => {
//           // console.log(e);
//           Alert.alert("Erro ao exportar o banco de dados", "Por favor, escolha outra pasta para realizar esta ação.");
//         });
//     } else {
//       showToast("Permissão negada", "error");
//     }
//   } else {
//     try {
//       await Sharing.shareAsync(FileSystem.documentDirectory + "SQLite/ltagDatabase");

//       showToast("Banco de dados exportado com sucesso", "success");
//     } catch (e) {
//       // console.log(e);
//       Alert.alert("Erro ao exportar o banco de dados", "Por favor, tente novamente em outro diretório.");
//     }
//   }
// };

export const exportDB = async (compartilhar = false) => {
  try {
    const dbPath = FileSystem.documentDirectory + "SQLite/ltagDatabase";
	console.log("Ao exportar, peguei daqui:");
	console.log(dbPath);


    // Verifica se o banco de dados existe
    const fileExists = await FileSystem.getInfoAsync(dbPath);
    if (!fileExists.exists) {
      throw new Error("O arquivo do banco de dados não foi encontrado.");
    }

	// LOG  file:///data/user/0/host.exp.exponent/files/SQLite/ltagDatabase.db
	// LOG  file:///data/user/0/host.exp.exponent/files/SQLite/ltagDatabase
    if (compartilhar) {
      // Compartilha o banco de dados
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(dbPath);
        showToast("Banco de dados compartilhado com sucesso!", "success");
      } else {
        throw new Error("A funcionalidade de compartilhamento não está disponível.");
      }
    } else {
      if (Platform.OS === "android") {
        // Solicita permissão para escolher o diretório
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          // Cria o arquivo no diretório escolhido
          const destUri = await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, "ltagDatabase.db", "application/octet-stream");

          // Escreve diretamente o arquivo no URI usando StorageAccessFramework
          const fileContents = await FileSystem.readAsStringAsync(dbPath, {
            encoding: FileSystem.EncodingType.Base64,
          });
          await FileSystem.StorageAccessFramework.writeAsStringAsync(destUri, fileContents, {
            encoding: FileSystem.EncodingType.Base64,
          });

          showToast("Banco de dados exportado com sucesso!", "success");
        } else {
          throw new Error("Permissão negada para acessar o diretório.");
        }
      } else {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(dbPath);
          showToast("Banco de dados compartilhado com sucesso!", "success");
        } else {
          throw new Error("Compartilhamento não disponível.");
        }
      }
    }
  } catch (error) {
    console.log("Erro ao exportar o banco de dados:", error);
    showToast("Erro ao exportar o banco de dados", "error");
  }
};

const dbDirectory = FileSystem.documentDirectory + "SQLite/";
const dbPath = dbDirectory + "ltagDatabase";

export const clearDatabase = async (dbName) => {
  try {
    console.log("Limpando db... recebi o nome do banco:", dbName);
	db.closeAsync();
    await SQLite.deleteDatabaseAsync(dbName);
    console.log("Banco de dados excluído com sucesso usando SQLite.deleteDatabaseAsync.");
    return true;
  } catch (error) {
    showToast("Erro ao limpar banco de dados", "error");
    console.log("Erro ao limpar banco de dados:", error);
    return false;
  }
};

// Função para sobrescrever o banco de dados
const updateDatabase = async (sourceUri, destinationPath) => {
	console.log("updateDatabase ->  ", destinationPath);
  try {
    console.log("Substituindo banco de dados...");
    await FileSystem.copyAsync({
      from: sourceUri,
      to: destinationPath,
    });
    console.log("Banco de dados substituído com sucesso.");
    return true;
  } catch (error) {
    showToast("Erro ao copiar banco de dados", "error");
    console.log("Erro ao copiar banco de dados:", error);
    return false;
  }
};

// Função para reabrir a conexão com o banco de dados
const reopenDatabase = () => {
  try {
    console.log("Reabrindo conexão com o banco de dados...");
    const db = SQLite.openDatabaseSync("ltagDatabase.db"); // Atualizado para método síncrono
    console.log("Banco de dados reaberto com sucesso.");
    return db;
  } catch (error) {
    showToast("Erro ao reabrir banco de dados", "error");
    console.log("Erro ao reabrir banco de dados:", error);
    return null;
  }
};

export const importDb = async (arg) => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: false,
    });

    if (result.canceled || !result.assets || !result.assets[0].uri) {
      showToast("Erro ao abrir arquivo", "error");
      return false;
    }

    console.log("Arquivo selecionado:", result.assets[0].uri);

    if (arg !== "new") {
      Alert.alert("Atenção", "Um banco de dados já existe. Deseja substituí-lo? Os dados atuais serão perdidos.", [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => console.log("Usuário cancelou a importação."),
        },
        {
          text: "Aceitar",
          onPress: async () => {
            console.log("Usuário aceitou substituir o banco de dados.");
            const isCleared = await clearDatabase("ltagDatabase");
            if (!isCleared) {
              showToast("Erro ao limpar banco de dados", "error");
              return false;
            }
            const isUpdated = await updateDatabase(result.assets[0].uri, dbPath);
            if (isUpdated) {
              const db = reopenDatabase();
              return !!db;
            } else {
              showToast("Erro ao importar banco de dados", "error");
              return false;
            }
          },
        },
      ]);
    } else {
      console.log("Argumento 'new', sobrescrevendo banco.");
      const isCleared = await clearDatabase("ltagDatabase");
      if (!isCleared) {
        showToast("Erro ao limpar banco de dados", "error");
        return false;
      }
      const isUpdated = await updateDatabase(result.assets[0].uri, dbPath);
      if (isUpdated) {
        const db = reopenDatabase();
        return !!db;
      } else {
        showToast("Erro ao importar banco de dados", "error");
        return false;
      }
    }
  } catch (error) {
    console.log("Erro ao importar o banco de dados:", error);
    showToast("Erro ao importar banco de dados", "error");
    return false;
  }
};
