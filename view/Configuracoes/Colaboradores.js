import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, Button, ScrollView, FlatList, StyleSheet, Alert, Animated, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DropdownSelector from "../../assets/components/DropdownSelector";
import { useTheme } from "../../ThemeContext";
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
  // const [msgErro, setMsgErro] = useState({ nome: false, servicos: false });
  const [msgErroNome, setMsgErroNome] = useState(false);
  const [msgErroServicos, setMsgErroServicos] = useState(false);

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
        style={styles.ServicosCard}
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
          <Text style={[styles.colaboradorNome, { color: textColor2 }]}>{item.Nome}</Text>
          <View style={{ marginVertical: 5 }}>
            {item.servicos && item.servicos.length > 0 ? (
              item.servicos.map((servico, index) => (
                <Text key={index} style={[styles.colaboradorServico, { color: textColor2 }]}>
                  {servico.Nome}
                </Text>
              ))
            ) : (
              <Text style={styles.colaboradorDescricao}>Nenhum serviço vinculado</Text>
            )}
          </View>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={theme == "dark" ? { fontSize: 12, color: "#ffff66" } : { fontSize: 12, color: "black" }}>Clique para editar ou excluir</Text>
        </View>
      </Pressable>
    );
  };
  const toggleForm = async (opt) => {
    if (opt == "close") {
      setNome("");
      setServicosSelecionados([]);
      setEditing(false);
      return setShowForm(false);
    }
    if (showForm) {
      if (nome.length < 3 || nome.length > 100) {
        await setMsgErroNome(true);
        return;
      } else {
        await setMsgErroNome(false);
      }
      if (servicosSelecionados.length === 0) {
        await setMsgErroServicos(true);
        return;
      } else {
        await setMsgErroServicos(false);
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
  const { theme, toggleTheme } = useTheme();
  const headerStyles = theme === "dark" ? styles.darkHeader : styles.lightHeader;
  const textColor = theme === "dark" ? "white" : "white";
  const textColor2 = theme === "dark" ? "white" : "black";
  const FundoThema = theme === "dark" ? "#020C2A" : "red";
  return (
    <>
      <View>
        <View contentContainerStyle={styles.container}>
          <View style={styles.scrollContainer}>
            <Animated.View style={{ width: "100%", height: animatedHeight, overflow: "hidden" }}>
              {showForm && (
                <View onLayout={handleLayout} style={[{ minHeight: 220, borderRadius: 20, padding: 20, marginBottom: 15 }, theme == "dark" ? { backgroundColor: "#001a66" } : { backgroundColor: "#2F407A" }]}>
                  <TouchableOpacity style={styles.closeButton} onPress={() => toggleForm("close")}>
                    <Ionicons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                  <Text style={[styles.label, { textAlign: "center", color: textColor }]}>{editing ? "Editando" : "Cadastrar Novo"}</Text>
                  <Text style={[styles.label, { color: textColor }]}>Nome do Colaborador:</Text>
                  <TextInput style={styles.input} value={nome} label="Nome do Colaborador" onChangeText={setNome} placeholder="Insira o nome do Colaborador" />
                  {msgErroNome && <Text style={{ color: "red", fontSize: 14 }}>O nome deve ter entre 3 e 100 caracteres.</Text>}
                  <Text style={{ color: textColor, paddingTop: 10 }}>Selecione os serviços do colaborador:</Text>
                  <DropdownSelector lista={todosServicos} label={"Serviço(s)"} icone={"briefcase-outline"} callbackSelecionados={setServicosSelecionados} selectedItems={servicosSelecionados} opt={"servico"} />
                  {msgErroServicos && <Text style={{ color: "red", fontSize: 14 }}>Selecione ao menos um serviço para cadastrar</Text>}
                  {editing && (
                    <View style={{ alignItems: "flex-end", marginTop: 10 }}>
                      <TouchableOpacity onPress={() => handleDelete(colaboradorSelecionado.id)}>
                        <Ionicons name="trash-outline" size={24} color={textColor} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </Animated.View>

            <View style={{ margin: "auto", marginBottom: 10, width: "84%" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#2F407A",
                  borderRadius: 10,
                  padding: 10,
                  alignItems: "center",
                  marginTop: 10,
                }}
                onPress={toggleForm}>
                <Text style={{ color: "white" }}>{showForm ? "Salvar" : "Cadastrar Novo"}</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.gridTitle, { color: textColor2 }]}>Colaboradores Cadastrados:</Text>
            {colaboradores && colaboradores.length > 0 ? (
              <FlatList scrollEnabled={true} data={colaboradores} renderItem={renderColaborador} keyExtractor={(item) => item.id.toString()} contentContainerStyle={styles.gridContainer} style={{ width: "100%", backgroundColor: { FundoThema }, borderRadius: 12 }} />
            ) : (
              <View style={{ width: "90%", borderRadius: 15, flexGrow: 1, justifyContent: "center" }}>
                <Text style={{ textAlign: "center", color: textColor2 }}>Nenhum colaborador cadastrado</Text>
                {!showForm && <Text style={{ textAlign: "center", color: textColor2 }}>Clique no botão abaixo para Cadastrar</Text>}
              </View>
            )}
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

export default Colaboradores;
