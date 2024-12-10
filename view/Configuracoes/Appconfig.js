import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, Button, ScrollView, FlatList, StyleSheet, Alert, Animated, ActivityIndicator, Pressable } from "react-native";
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
import Modal from "react-native-modal";

const AppConfig = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const textColor = theme === "dark" ? "white" : "black";
  const textColor2 = theme === "dark" ? "white" : "black";
  const FundoThema = theme === "dark" ? "#020C2A" : "red";
  const transparentBG = theme === "dark" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.8)";
  const [modalexport, setModalExport] = useState(false);

  const navigation = useNavigation();

  const handleImport = async () => {
    setIsLoading(true);
    query();
 
    
    async function query() {
      await importDb().then((response) => {
        if (response && response.success) {
          setIsLoading(false);
          navigation.navigate("Home", { screen: "Home" });
        } else {
          // Toast.show("Falha ao importar banco de dados", {
          //   duration: Toast.durations.SHORT,
          //   position: Toast.positions.BOTTOM,
          //   shadow: true,
          //   animation: true,
          //   hideOnPress: true,
          //   delay: 0,
          // });
        }
      });
    }

    setIsLoading(false);
  };

  const handleExport = async () => {
    setModalExport(true);
    //verificar se quer salvar localmente ou remoto...
    // setIsLoading(true);
    // await exportDB();
    // setIsLoading(false);
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
          let response = await LocalAuthentication.getEnrolledLevelAsync();
          if (response == 0) {
            console.log("Não existe biometria cadastrada");
            foo();
          } else {
            LocalAuthentication.authenticateAsync().then(async (result) => {
              if (result.success) {
                foo();
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
        },
      },
    ]);

    async function foo() {
      setIsLoading(true);
      const retorno = await clearDatabase("ltagDatabase");
      setIsLoading(false);
      if (retorno) {
        //aqui tem que reiniciar o aplicativo
        navigation.navigate("Home", { screen: "Home" });
      }
    }
  };

  const handleLocalImport = async () => {
    setModalExport(false);
    setIsLoading(true);
    await exportDB();
    setIsLoading(false);
  };

  const handleShare = async () => {
    setModalExport(false);
    setIsLoading(true);
    await exportDB("share");
    setIsLoading(false);
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
          {/* <View style={styles.childContainer}>
            <Text>Escolher entre opções de tema</Text>
            <TouchableOpacity style={[styles.button, { backgroundColor: "#2F407A" }]} onPress={() => Alert.alert("nada ainda")}>
              <Text style={{ color: "white" }}>Alterar Tema</Text>
              <Ionicons name="contrast-outline" size={30} color={"white"} />
            </TouchableOpacity>
          </View> */}
          <View style={styles.childContainer}>
            <Text style={{ color: textColor, fontSize: 22, fontWeight: "bold", marginBottom: 15, color: textColor, textAlign: "left", width: "100%" }}>Banco de Dados</Text>
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
            <Text style={{ color: textColor, fontSize: 20, fontWeight: "bold", marginBottom: 15, color: textColor, textAlign: "left", width: "100%" }}>Reiniciar configurações de Fábrica</Text>
            <TouchableOpacity style={[styles.button, { backgroundColor: "#2F407A" }]} onPress={handleClearDB}>
              <Text style={{ color: "white", width: "100%", textAlign: "center" }}>Limpar Banco de Dados</Text>
            </TouchableOpacity>
          </View>
          <View>
            <DetalhesAtendimento />
          </View>
        </View>
      </ScrollView>
      <Modal
        testID={"modal"}
        isVisible={modalexport}
        hasBackdrop={true}
        backdropColor="rgba(0,0,0,0.5)"
        onRequestClose={() => {
          setModalExport(false);
        }}
        onBackdropPress={() => {
          setModalExport(false);
        }}
        onSwipeComplete={() => {
          setModalExport(false);
        }}
        swipeDirection={"down"}
        style={{ justifyContent: "flex-end", margin: 0 }}>
        <View style={{ backgroundColor: textColor == "white" ? "#00002b" : "white", padding: 0, borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
          <Text style={{ textAlign: "center", padding: 20, color: textColor, fontSize: 16 }}>Como deseja enviar este arquivo?</Text>
          <Pressable style={styles.itemModal} onPress={handleLocalImport}>
            <Text style={{ color: "white", fontSize: 15 }}>Salvar localmente</Text>
            <Ionicons name="download-outline" size={30} color={"white"} />
          </Pressable>
          <Pressable style={styles.itemModal} onPress={handleShare}>
            <Text style={{ color: "white", fontSize: 15 }}>Compartilhar</Text>
            <Ionicons name="share-social-outline" size={30} color={"white"} />
          </Pressable>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  itemModal: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignSelf: "center",
    paddingHorizontal: 20,
    alignItems: "center",
    width: "90%",
    padding: 10,
    marginVertical: 5,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    backgroundColor: "#2F407A",
    borderRadius: 10,
  },
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
