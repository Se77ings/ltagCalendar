import React, { useState, useEffect, useRef } from "react";
import { View, Text, Switch, TouchableOpacity, TextInput, Pressable, ScrollView, FlatList, StyleSheet, Alert, Animated } from "react-native";
import { useNavigation, DefaultTheme, DarkTheme} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeContext"; // Usando o hook useTheme para acessar o estado do tema
import adicionarServico, { AtualizarServicoAsync, DesabilitarServicoAsync, ExisteAtendimentoComServicoAsync, ExisteServicoComColaboradorAsync, ObterTodosServicosAsync, ObterTodosServicosAtivosAsync, RemoverServicoAsync } from "../../services/servicoService";

const Servicos = () => {
  const navigation = useNavigation();
  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [favorito, setFavorito] = useState(false);

  const [servicos, setServicos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({ nome: "", descricao: "" });
  const [editingServicos, setEditingServicos] = useState(null);
  const [formHeight, setFormHeight] = useState(0);
  const [formAnimation] = useState(new Animated.Value(0));

  const validateFields = () => {
    let valid = true;
    let errors = { nome: "", descricao: "" };

    if (nome.length < 3 || nome.length > 100) {
      errors.nome = "O nome deve ter entre 3 e 100 caracteres.";
      valid = false;
    }

    if (descricao.length < 3 || descricao.length > 100) {
      errors.descricao = "A descrição deve ter entre 3 e 100 caracteres.";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = () => {
    if (!validateFields()) {
      return;
    }

    if (editingServicos == true) {
      AtualizarServicoAsync({ id, nome, descricao, favorito });
      fetchServicos();
      setEditingServicos(null);
      Alert.alert("Sucesso", "Serviço Editado com sucesso!"); //trocar por um popup
    } else {
      let NovoServico = { nome, descricao, favorito };
      adicionarServico(NovoServico);
      Alert.alert("Sucesso", "Serviço cadastrado com sucesso!"); //trocar por um popup
    }
    fetchServicos();
    setNome("");
    setDescricao("");
    EscodeForm();
  };

  const fetchServicos = async () => {
    try {
      let response = await ObterTodosServicosAtivosAsync();
      if (response.success) {
        setServicos(response.data);
      } else {
        console.error("Erro ao obter serviços:", response.error);
      }
    } catch (error) {
      console.error("Erro ao buscar Servicos:", error);
    }
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  const renderServicos = ({ item }) => (
    <Pressable
  style={item.Desabilitado ? styles.ServicosCardDesabilitado : styles.ServicosCard}
  onPress={async () => {
    setId(item.id);
    setNome(item.Nome);
    setDescricao(item.Descricao);
    setFavorito(item.Favorito);
    setEditingServicos(true);
    abrirFormulario();
  }}
>
  <View>
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start"}}>
      {/* Ajuste 1: Adicionamos flex: 1 e marginRight para o container do texto, para garantir espaço adequado ao ícone */}
      <View style={{ flex: 1, marginRight: 8 }}>
        <Text style={item.Desabilitado == false ? [theme == "dark" ? [styles.ServicosNome, {color:'white'}]: styles.ServicosNome] : styles.ServicosNomeDesabilitado}>
          {item.Nome}
        </Text>
        
        {/* Ajuste 2: Adicionamos flexShrink e flexWrap à descrição para evitar que ela force o ícone para fora */}
        <Text style={theme == "dark"? {color:"#bfbfbf"} : {color:"black",fontSize:14, flexShrink: 1, flexWrap: 'wrap'} }>
          {item.Descricao}
        </Text>
      </View>

      {/* Ícone permanece alinhado ao topo e não é afetado pelo tamanho do texto devido aos ajustes */}
      <Ionicons
        name="star"
        size={24}
        color={item.Favorito ? "#ffcc00" : "gray"}
        style={{ alignSelf: "flex-start" }}
      />
    </View>
    
    <View style={{ alignItems: "center" }}>
      <Text style={theme == "dark" ? { fontSize: 12, color:'#ffff66'} : { fontSize: 12, color:'black'}}>Clique para editar ou excluir</Text>
    </View>
  </View>
</Pressable>

  );

  abrirFormulario = () => {
    if (editingServicos) {
      return;
    }
    setShowForm(true);
    // Animação para mostrar o formulário
    Animated.timing(formAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  const EscodeForm = () => {
    setId("");
    setNome("");
    setDescricao("");
    setFavorito(false);
    Animated.timing(formAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setShowForm(false);
      setEditingServicos(null);
    });
  };

  const toggleForm = () => {
    if (!showForm) {
      abrirFormulario();
    } else {
      EscodeForm();
    }
  };

  const handleDelete = async (serviceId) => {
    var res = await ExisteServicoComColaboradorAsync(serviceId);
    var res2 = await ExisteAtendimentoComServicoAsync(serviceId);
    if (res2.data) {
      return Alert.alert("Atenção!!!", "O serviço esta vinculado a um agendamento, não é possivel excluir!");
    }

    if (res.data == false) {
      Alert.alert("Confirmação", "Você tem certeza que deseja desativar este serviço?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: async () => {
            var res2 = await DesabilitarServicoAsync(serviceId);
            if (res2.success == true) {
              setId("");
              setNome("");
              setDescricao("");
              setFavorito(false);
              toggleForm();
              Alert.alert("Sucesso", "Serviço desativado com sucesso!");
              fetchServicos();
            } else Alert.alert("Erro", "Não foi possível desativar o serviço!");
          },
        },
      ]);
    } else if (res.error == null) {
      Alert.alert("Atenção", "Não foi possivel excluir o serviço pois ele esta vinculado a um Colaborador!");
    } else {
      Alert.alert("Erro interno, procure um Administrador");
      console.log("Erro interno: " + res.error); //podemos criar um arquivo de log para salvar esses erros
    }
  };

  const [mostrarDesabilitados, setMostrarDesabilitados] = useState(true);
  const handleMostraServicoDesabilitado = async () => {
    const desabilitado = mostrarDesabilitados ? "true" : "false";

    if (desabilitado === "true") {
      let response = await ObterTodosServicosAsync();
      if (response.success) {
        setServicos(response.data);
      } else {
        console.error("Erro ao obter serviços:", response.error);
      }
    } else {
      fetchServicos();
    }

    // Alterna o valor de mostrarDesabilitados
    setMostrarDesabilitados(!mostrarDesabilitados);
  };

  const handleLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setFormHeight(height);
  };
  useEffect(() => {
    if (showForm) {
      Animated.timing(formAnimation, {
        toValue: formHeight,
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
  }, [showForm, formHeight]);

  const toggleFavorito = () => {
    setFavorito((prevFavorito) => !prevFavorito);
  };

  const { theme, toggleTheme } = useTheme();

  // Estilos baseados no tema atual
  const headerStyles = theme === "dark" ? styles.darkHeader : styles.lightHeader;
  const textColor = theme === "dark" ? "white" : "black";
  const FundoThema = theme === "dark" ? "#020C2A" : "red";
  return (
    <>
      <View contentContainerStyle={styles.container}>
        <View style={styles.scrollContainer}>
          <Animated.View style={{ width: "100%", height: formAnimation, overflow: "hidden" }}>
            {showForm && (
              <View onLayout={handleLayout} style={{ minHeight: 220, borderWidth: 0, borderColor: "#666699", borderRadius: 20, padding: 20, backgroundColor: "#c2c2d6", marginBottom: 15 }}>
                <TouchableOpacity style={styles.closeButton} onPress={toggleForm}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.label}>Nome do Serviço:</Text>
                <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Insira o nome do serviço" />
                {errors.nome ? <Text style={styles.error}>{errors.nome}</Text> : null}

                <Text style={styles.label}>Descrição:</Text>
                <TextInput style={styles.textArea} value={descricao} onChangeText={setDescricao} placeholder="Insira a descrição do serviço" multiline numberOfLines={4} />
                {errors.descricao ? <Text style={styles.error}>{errors.descricao}</Text> : null}

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 5 }}>
                  <View style={styles.switchContainer}>
                    <Text style={styles.label}>Favorito : </Text>
                    <Ionicons onPress={toggleFavorito} name="star" size={24} color={favorito ? "#ffcc00" : "gray"} style={{ alignSelf: "flex-start" }} />
                  </View>

                  {/* Botão de excluir posicionado à direita */}
                  <TouchableOpacity onPress={() => handleDelete(id)} style={{ marginLeft: 10 }}>
                    <Ionicons name="trash" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Animated.View>

          <View style={{ margin: "auto", marginVertical: 10, width: "84%" }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#2F407A",
                borderRadius: 10,
                padding: 10,
                alignItems: "center",
              }}
              onPress={showForm ? handleSubmit : toggleForm}>
              <Text style={{ color: "white" }}>{editingServicos ? "Editar" : "Criar Serviço"}</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.gridTitle, {color:textColor}]}>Servicos Cadastrados:</Text>
          {servicos && servicos.length > 0 ? (
            <FlatList scrollEnabled={true} data={servicos} renderItem={renderServicos} keyExtractor={(item) => item.id.toString()} contentContainerStyle={styles.gridContainer} style={{ width: "100%", backgroundColor:{FundoThema}, borderRadius: 12 }} />
          ) : (
            <View style={{ width: "90%", backgroundColor: "#a3a3c2", borderRadius: 15, flex: 1, justifyContent: "center" }}>
              <Text style={{ textAlign: "center" }}>Nenhum Servico cadastrado</Text>
              {!showForm && <Text style={{ textAlign: "center" }}>Clique no botão abaixo para Cadastrar</Text>}
            </View>
          )}

          <TouchableOpacity onPress={() => handleMostraServicoDesabilitado()} style={{ marginTop: 2 }}>
            <Ionicons name="albums-outline" size={15} color={textColor}>
              <Text style={{ textAlign: "center", fontSize: 20, color:textColor }}>{mostrarDesabilitados ? "Mostrar Todos" : "Mostrar Apenas Habilitados"}</Text>
            </Ionicons>
          </TouchableOpacity>
        </View>
      </View>
    </>
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
    height: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#312fbf", // Nova cor
  },
  input: {
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

export default Servicos;
