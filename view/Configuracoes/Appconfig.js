import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, Button, ScrollView, FlatList, StyleSheet, Alert, Animated, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DropdownSelector from "../../assets/components/DropdownSelector";
import { useTheme } from "../../ThemeContext";
import { ObterServicosPorColaborador, ObterServicosPorFavorito, VincularServicoColaborador } from "../../database/servicoRepository";
import adicionarColaborador, { AtualizarColaboradorAsync, ObterTodosColaboradoresComServicosAsync, RemoverColaboradorAsync } from "../../services/colaboradorService";
import { clearDatabase, exportDB, importDb } from "../../assets/global/functions";
import { useNavigation } from "@react-navigation/native";
import * as LocalAuthentication from "expo-local-authentication";
import Toast from "react-native-root-toast";
import DetalhesAtendimento from "./GerenciarMensagem";

const AppConfig = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const textColor = theme === "dark" ? "white" : "black";
  const textColor2 = theme === "dark" ? "white" : "black";
  const FundoThema = theme === "dark" ? "#020C2A" : "red";
  const transparentBG = theme === "dark" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.8)";

  const navigation = useNavigation();

  const handleImport = async () => {
    setIsLoading(true);
    LocalAuthentication.getEnrolledLevelAsync().then((response) => {
      if (response == 0) {
        console.log("Não existe biometria cadastrada");
        query();
      } else {
        LocalAuthentication.authenticateAsync().then((result) => {
          console.log("Existe success em response? ", result);
          if (result.success) {
            console.log("result.success é true");
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
            setIsLoading(false);
          }
        });
      }
    });

    async function query() {
      await importDb().then((response) => {
        console.log("response-> ", response);
        if (response && response.success) {
          setIsLoading(false);
          navigation.navigate("Home", { screen: "Home" });
        } else {
          Toast.show("Falha ao importar banco de dados", {
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

    setIsLoading(false);
  };

  const handleExport = async () => {
    setIsLoading(true);
    await exportDB();
    setIsLoading(false);
  };

  const handleClearDB = async () => {
    Alert.alert("Limpar Banco de Dados", "Tem certeza que deseja limpar o banco de dados? Esta ação não pode ser desfeita.", [
      {
        text: "Cancelar",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Sim",

        onPress: async () => {
          setIsLoading(true);
          await clearDatabase("ltagDatabase");
          setIsLoading(false);
          //aqui tem que reiniciar o aplicativo
          navigation.navigate("Home", { screen: "Home" });
        },
      },
    ]);
  };

  return (
    <>
      {isLoading && (
        <View style={[styles.loadingStyle, { backgroundColor: transparentBG }]}>
          <ActivityIndicator size="large" color={textColor} />
        </View>
      )}
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <View style={styles.childContainer}>
            <Text>Escolher entre opções de tema</Text>
            <TouchableOpacity style={[styles.button, { backgroundColor: "#2F407A" }]} onPress={() => Alert.alert("nada ainda")}>
              <Text style={{ color: "white" }}>Alterar Tema</Text>
              <Ionicons name="contrast-outline" size={30} color={"white"} />
            </TouchableOpacity>
          </View>
          <View style={styles.childContainer}>
            <Text style={{ color: textColor }}>Banco de Dados</Text>
            <TouchableOpacity style={[styles.button, { backgroundColor: "#2F407A" }]} onPress={handleImport}>
              <Text style={{ color: "white" }}>Importar Banco de Dados</Text>
              <Ionicons name="cloud-upload-outline" size={30} color={"white"} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: "#2F407A" }]} onPress={handleExport}>
              <Text style={{ color: "white" }}>Exportar Banco de Dados</Text>
              <Ionicons name="download-outline" size={30} color={"white"} />
            </TouchableOpacity>
          </View>
          <View style={styles.childContainer}>
            <Text style={{ color: textColor }}>Reiniciar configurações de Fábricas</Text>
            <TouchableOpacity style={[styles.button, { backgroundColor: "#2F407A" }]} onPress={handleClearDB}>
              <Text style={{ color: "white", width: "100%" }}>Limpar Banco de Dados</Text>
            </TouchableOpacity>
          </View>
          <View>
            <DetalhesAtendimento />
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  loadingStyle: {
    position: "absolute",
    zIndex: 1,
    justifyContent: "center",
    alignSelf: "center",
    height: "100%",
    width: "100%",
  },

  container: {
    flexGrow: 1,
    justifyContent: "space-between",
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
    borderColor: "white",
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
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
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

  gridTitle: {
    fontSize: 20,
    margin: 0,
    fontWeight: "bold",
    color: "#312fbf",
  },
  gridContainer: {
    paddingHorizontal: 20,
  },
});
export default AppConfig;
