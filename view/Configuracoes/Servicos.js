import React, { useState, useEffect, useRef } from "react";
import { View, Text, Switch, TouchableOpacity, TextInput, Pressable, ScrollView, FlatList, StyleSheet, Alert, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; 
import adicionarServico, { AtualizarServicoAsync, ExisteAtendimentoComServicoAsync, ExisteServicoComColaboradorAsync, ObterTodosServicosAsync, RemoverServicoAsync } from "../../services/servicoService";
import { StatusBar } from "expo-status-bar";
import { ExisteAtendimentoComServico } from "../../database/servicoRepository";


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
  const formAnimation = useRef(new Animated.Value(0)).current; 

  const [objeto, setObjeto] = useState(null);


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
    } else {
      let NovoServico = { nome, descricao, favorito };
      adicionarServico(NovoServico);
    }
    Alert.alert("Sucesso", "Serviço cadastrado com sucesso!"); //trocar por um popup
    fetchServicos();
    setNome("");
    setDescricao("");
    EscodeForm();
  };

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

  const fetchServicos = async () => {
    try {
      let response = await ObterTodosServicosAsync();
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

  // const handleEdit = (Servicos) => {
  //   setNome(Servicos.nome);
  //   setDescricao(Servicos.descricao);
  //   setEditingServicos(Servicos);
  //   if (!showForm) {
  //     toggleForm();
  //   }
  // };

  const renderServicos = ({ item }) => (
    <Pressable
        onPress={async () => {
          abrirFormulario();
          setId(item.id)
          setNome(item.Nome);
          setDescricao(item.Descricao);
          setFavorito(item.Favorito);
          setEditingServicos(true);

        }}>
      <View style={styles.ServicosCard} >
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
    setShowForm(true);
      // Animação para mostrar o formulário
      Animated.timing(formAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
  }

  const toggleForm = () => {
    if (!showForm) {
      abrirFormulario();
    } else {
      EscodeForm();
    }
  };

  const handleDelete = async (serviceId) => {
    var res = await ExisteServicoComColaboradorAsync(serviceId);
    console.log(res);

    if(res.success == false){
      Alert.alert(
        "Confirmação",
        "Você tem certeza que deseja excluir este serviço?",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Excluir", 
            onPress: async () => {
              await RemoverServicoAsync(serviceId);
              fetchServicos();
              setId("");
              setNome("");
              setDescricao("");
              toggleForm();
              Alert.alert("Sucesso", "Serviço excluído com sucesso!");
            } 
          }
        ]
      );
    }else if(res.error != null){
      Alert.alert("Atenção", "Não foi possivel excluir o serviço pois ele esta vinculado a um Colaborador!");
    }
  };

  const formHeight = formAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  const toggleSwitch = () => setFavorito((previousState) => !previousState);

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View style={{ width: "90%", height: formHeight, overflow: "hidden" }}>
            {showForm && (
              <View style={{ borderColor: "#666699", borderRadius: 20, padding: 20, backgroundColor: "#c2c2d6" }}>
                <TouchableOpacity style={styles.closeButton} onPress={EscodeForm}>
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
            <FlatList scrollEnabled={true} data={servicos} renderItem={renderServicos} keyExtractor={(item) => item.id.toString()} contentContainerStyle={styles.gridContainer} style={{ width: "100%", height:'100%', backgroundColor: "#a3a3c2", borderRadius: 12, flex: 1}} />
          ) : (
            <View style={{ width: "90%", backgroundColor: "#a3a3c2", borderRadius: 15, flex: 1, justifyContent: "center" }}>
            <Text style={{ textAlign: "center" }}>Nenhum Servico cadastrado</Text>
            {!showForm && <Text style={{ textAlign: "center" }}>Clique no botão abaixo para Cadastrar</Text>}
          </View>
          )}
        
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
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingTop: 0,
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
    color: "#666699",
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
    marginTop: 10,
    marginBottom: 10,
    borderColor: "#666699",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    backgroundColor: "#e0e0eb",
  },
  ServicosNome: {
    fontWeight: "bold",
    fontSize: 16,
  },
  ServicosDescricao: {
    color: "#555",
  },
});

export default Servicos;
