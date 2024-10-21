import React, { useState, useEffect, useRef } from "react";
import { View, Text, Switch, TouchableOpacity, TextInput, Pressable, ScrollView, FlatList, StyleSheet, Alert, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; 
import adicionarServico, { AtualizarServicoAsync, DesabilitarServicoAsync, ExisteServicoComColaboradorAsync, ObterTodosServicosAsync, ObterTodosServicosAtivosAsync, RemoverServicoAsync } from "../../services/servicoService";
import { StatusBar } from "expo-status-bar";


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
      AtualizarServicoAsync({id,nome,descricao,favorito});
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
        style={styles.ServicosCard}  
        onPress={async () => {
          abrirFormulario();
          setId(item.id)
          setNome(item.Nome);
          setDescricao(item.Descricao);
          setFavorito(item.Favorito);
          setEditingServicos(true);

        }}>
      <View >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={styles.ServicosNome}>{item.Nome}</Text>
            <Text style={styles.ServicosDescricao}>{item.Descricao}</Text>
          </View>
          <Ionicons name="star" size={24} color={item.Favorito ? "#666699" : "gray"} style={{ alignSelf: "flex-start" }} />
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 12, color: "#276000" }}>Clique para editar ou excluir</Text>
        </View>
      </View>
    </Pressable>
  );

  abrirFormulario = () => {
    if(editingServicos){
      return;
    }
    setShowForm(true);
      // Animação para mostrar o formulário
      Animated.timing(formAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
  }
  const EscodeForm = () => {
    setId('');
    setNome('');
    setDescricao('');
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
    console.log("O serviço vinculado esta retornando vinculado?: " + res.success + " " + res.error);

    if(res.data == false){
      Alert.alert(
        "Confirmação",
        "Você tem certeza que deseja desativar este serviço?",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Excluir", 
            onPress: async () => {
              var res2 = await DesabilitarServicoAsync(serviceId);
              if(res2.success == true){
                setId("");
                setNome("");
                setDescricao("");
                toggleForm();
                Alert.alert("Sucesso", "Serviço desativado com sucesso!");
                fetchServicos();

              }else
                Alert.alert("Erro", "Não foi possível desativar o serviço!");
            } 
          }
        ]
      );
    }else if(res.error == null){
      Alert.alert("Atenção", "Não foi possivel excluir o serviço pois ele esta vinculado a um Colaborador!");
    }
    else{
      Alert.alert("Erro interno, procure um Administrador");
      console.log("Erro interno: " + res.error); //podemos criar um arquivo de log para salvar esses erros
    }
  };

  const [mostrarDesabilitados, setMostrarDesabilitados] = useState(false);
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

  const toggleSwitch = () => setFavorito((previousState) => !previousState);

  return (
    <>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.scrollContainer}>
          <Animated.View style={{ width: "90%", height: formAnimation, overflow: "hidden" }}>
            {showForm && (
              <View onLayout={handleLayout} style={{minHeight:220, borderWidth: 0, borderColor: "#666699", borderRadius: 20, padding: 20, backgroundColor: "#c2c2d6", marginBottom: 15 }}>
                <TouchableOpacity style={styles.closeButton} onPress={toggleForm}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.label}>Nome do Serviço:</Text>
                <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Insira o nome do serviço" />
                {errors.nome ? <Text style={styles.error}>{errors.nome}</Text> : null}

                <Text style={styles.label}>Descrição:</Text>
                <TextInput style={styles.textArea} value={descricao} onChangeText={setDescricao} placeholder="Insira a descrição do serviço" multiline numberOfLines={4} />
                {errors.descricao ? <Text style={styles.error}>{errors.descricao}</Text> : null}

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={styles.switchContainer}> 
                    <Text style={styles.label}>Favoritar?</Text>
                    <Switch trackColor={{ false: "white", true: "white" }} thumbColor={favorito ? "#3d3d5c" : "#f4f3f4"} ios_backgroundColor="#3e3e3e" onValueChange={toggleSwitch} value={favorito} />
                  </View>
                  
                  {/* Botão de excluir posicionado à direita */}
                  <TouchableOpacity onPress={() => handleDelete(id)} style={{ marginLeft: 10 }}>
                    <Ionicons name="trash" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Animated.View>

          <Text style={styles.gridTitle}>Servicos Cadastrados:</Text>
          {servicos && servicos.length > 0 ? (
            <FlatList scrollEnabled={false} data={servicos} renderItem={renderServicos} keyExtractor={(item) => item.id.toString()} contentContainerStyle={styles.gridContainer} style={{ width: "100%", height:'100%', backgroundColor: "#a3a3c2", borderRadius: 12, flex: 1}} />
          ) : (
            <View style={{ width: "90%", backgroundColor: "#a3a3c2", borderRadius: 15, flex: 1, justifyContent: "center" }}>
            <Text style={{ textAlign: "center" }}>Nenhum Servico cadastrado</Text>
            {!showForm && <Text style={{ textAlign: "center" }}>Clique no botão abaixo para Cadastrar</Text>}
          </View>
          )}

          <TouchableOpacity onPress={() => handleMostraServicoDesabilitado()} style={{marginTop:2}}>
                  <Ionicons name="albums-outline" size={15} color="black"><Text style={{ textAlign: "center", fontSize:20}}>{mostrarDesabilitados ? "Mostrar Apenas Habilitados" : "Mostrar Todos"}</Text></Ionicons>  
          </TouchableOpacity>
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
            onPress={showForm ? handleSubmit : toggleForm}>
            <Text style={{ color: "white" }}>{editingServicos ? "Editar" : "Criar Serviço"}</Text>
          </TouchableOpacity>
        </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
   // flex: 1,
   justifyContent: "flex-start",
   paddingTop: 0,
   backgroundColor: "#f8f9fa", // Nova cor de fundo
   height: "100%",
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
  ServicosNome: {
    ffontWeight: "bold",
    fontSize: 16,
    color: "#14213b",
  },
  ServicosDescricao: {
    color: "#777",
    fontSize: 14,
  },
});

export default Servicos;
