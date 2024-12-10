import { Alert, Platform } from "react-native";
import * as SQLite from "expo-sqlite";
import Toast from "react-native-root-toast";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { getDatabaseInstance, initialize } from "../../database/database";
import { limpaDatabase } from "../../database/initializeDatabase";
import * as LocalAuthentication from "expo-local-authentication";

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

export const exportDB = async (compartilhar = false) => {
  try {
    const dbPath = FileSystem.documentDirectory + "SQLite/ltagDatabase";

    const fileExists = await FileSystem.getInfoAsync(dbPath);
    if (!fileExists.exists) {
      throw new Error("O arquivo do banco de dados não foi encontrado.");
    }

    if (compartilhar) {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(dbPath);
        showToast("Banco de dados compartilhado com sucesso!", "success");
      } else {
        throw new Error("A funcionalidade de compartilhamento não está disponível.");
      }
    } else {
      if (Platform.OS === "android") {
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

export const clearDatabase = async () => {
  try {
    await limpaDatabase();

    return true;
  } catch (error) {
    showToast("Erro ao limpar banco de dados", "error");
    console.log("Erro ao limpar banco de dados:", error);
    return false;
  }
};

// Função para sobrescrever o banco de dados
const updateDatabase = async (sourceUri, destinationPath) => {
  try {
    await FileSystem.copyAsync({
      from: sourceUri,
      to: destinationPath,
    });

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

    const fileUri = result.assets[0].uri;
    console.log("Arquivo selecionado:", fileUri);

    // Validação do tipo de arquivo
    if (!fileUri.endsWith(".db")) {
      showToast("Tipo de arquivo inválido. Por favor, selecione um arquivo .db", "error");
      return false;
    }

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
            LocalAuthentication.getEnrolledLevelAsync().then((response) => {
              if (response == 0) {
                console.log("Não existe biometria cadastrada");
                query();
              } else {
                LocalAuthentication.authenticateAsync().then(async (result) => {
                  if (result.success) {
                    console.log("Usuário aceitou substituir o banco de dados.");
                    query();
                  } else {
                    Toast.show("Falha na senha, tente novamente", {
                      duration: Toast.durations.SHORT,
                      position: Toast.positions.BOTTOM,
                      shadow: true,
                      animation: true,
                      hideOnPress: true,
                      delay: 0,
                    });
                  }
                });
              }
            });
          },
        },
      ]);
    } else {
      console.log("Argumento 'new', sobrescrevendo banco.");

      LocalAuthentication.getEnrolledLevelAsync().then(async (response) => {
        if (response == 0) {
          console.log("Não existe biometria cadastrada");
          const isUpdated = await updateDatabase(fileUri, dbPath);
          if (isUpdated) {
            const db = reopenDatabase();
            return !!db;
          } else {
            showToast("Erro ao importar banco de dados", "error");
            return false;
          }
        } else {
          LocalAuthentication.authenticateAsync().then(async (result) => {
            if (result.success) {
              console.log("Usuário aceitou substituir o banco de dados.");
              const isUpdated = await updateDatabase(fileUri, dbPath);
              if (isUpdated) {
                const db = reopenDatabase();
                return !!db;
              } else {
                showToast("Erro ao importar banco de dados", "error");
                return false;
              }
            } else {
              Toast.show("Falha na senha, tente novamente", {
                duration: Toast.durations.SHORT,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
              });
            }
          });
        }
      });
    }

    async function query() {
      const isUpdated = await updateDatabase(fileUri, dbPath);
      if (isUpdated) {
        showToast("Banco de dados importado com sucesso", "success");
      } else {
        showToast("Erro ao importar banco de dados", "error");
      }
    }
  } catch (error) {
    console.log("Erro ao importar o banco de dados:", error);
    showToast("Erro ao importar banco de dados", "error");
    return false;
  }
};
