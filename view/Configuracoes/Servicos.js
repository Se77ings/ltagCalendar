import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, Button, ScrollView, FlatList, StyleSheet, Alert, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons'; // Se estiver usando Expo, ou outro ícone de sua escolha
import { FloatingLabelInput } from 'react-native-floating-label-input';

const Servicos = () => {
  const navigation = useNavigation();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [colaboradores, setColaboradores] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({ nome: "", descricao: "" });
  const [editingColaborador, setEditingColaborador] = useState(null);
  const formAnimation = useRef(new Animated.Value(0)).current; // Inicializa o valor da animação

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

    if (editingColaborador) {
      // Atualizar colaborador existente
      setColaboradores(prev =>
        prev.map(colab =>
          colab.id === editingColaborador.id ? { ...colab, nome, descricao } : colab
        )
      );
      setEditingColaborador(null);
    } else {
      // Adicionar novo colaborador
      setColaboradores(prev => [...prev, { id: colaboradores.length + 1, nome, descricao }]);
    }

    Alert.alert("Sucesso", "Serviço cadastrado com sucesso!");
    setNome("");
    setDescricao("");
    EscodeForm();
  };

  const EscodeForm = () => {
    Animated.timing(formAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setShowForm(false);
      setEditingColaborador(null);
    });
  };

  const fetchColaboradores = async () => {
    try {
      // Simulando uma busca em um banco de dados
      const response = await fetch('URL_DA_API_PARA_COLABORADORES');
      const data = await response.json();
      setColaboradores(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchColaboradores();
  }, []);

  const handleEdit = (colaborador) => {
    setNome(colaborador.nome);
    setDescricao(colaborador.descricao);
    setEditingColaborador(colaborador);
    if (!showForm) {
      toggleForm();
    }
  };

  const renderColaborador = ({ item }) => (
    <TouchableOpacity onPress={() => handleEdit(item)}>
      <View style={styles.colaboradorCard}>
        <View>
          <Text style={styles.colaboradorNome}>{item.nome}</Text>
          <Text style={styles.colaboradorDescricao}>{item.descricao}</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: '#276000' }}>Clique para editar</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const toggleForm = () => {
    if (!showForm) {
      setShowForm(true);
      // Animação para mostrar o formulário
      Animated.timing(formAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      EscodeForm();
    }
  };

  const formHeight = formAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 255],
  });

  const handleScroll = () => {

      EscodeForm();
    
  };

  return (
    <View style={styles.container}>
       <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View style={{ width: '90%', height: formHeight, overflow: 'hidden' }}>
          {showForm && (
            <View style={{ borderColor: '#666699', borderRadius: 20, padding: 20, backgroundColor: '#c2c2d6' }}>
              <TouchableOpacity style={styles.closeButton} onPress={EscodeForm}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.label}>Nome do Serviço:</Text>
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Insira o nome do serviço"
              />
              {errors.nome ? <Text style={styles.error}>{errors.nome}</Text> : null}

              <Text style={styles.label}>Descrição:</Text>
              <TextInput
                style={styles.textArea}
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Insira a descrição do serviço"
                multiline
                numberOfLines={4}
              />
              {errors.descricao ? <Text style={styles.error}>{errors.descricao}</Text> : null}

              {/* escluir */}
              {/* <Button onPress={handleSubmit} title={editingColaborador ? "Editar" : "Salvar"} color={'#3d3d5c'} /> */} 
            </View>
          )}
        </Animated.View>

        <Text style={styles.gridTitle}>Colaboradores Cadastrados:</Text>
        <FlatList
          data={colaboradores}
          renderItem={renderColaborador}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.gridContainer}
          style={{ width: '90%', backgroundColor: '#a3a3c2', borderRadius: 15 }}
        />
      </ScrollView>
      <View style={{ margin: 'auto', marginBottom: 10, width: '84%' }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#3d3d5c',
            borderRadius: 10,
            padding: 10,
            alignItems: 'center'
          }}
          onPress={showForm ? handleSubmit : toggleForm}
        >
          <Text style={{ color: 'white' }}>
            {editingColaborador ? "Editar" : "Salvar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 10,  // Distância do topo
    right: 10, // Distância da direita
    zIndex: 1,
    backgroundColor: '#666699',
    borderRadius: 15,
    padding: 0,
  },
  Header: {
    width: '100%',
    alignItems: 'center'
  },
  scrollContainer: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666699',
  },
  input: {
    height: 50,
    borderColor: '#ced4da',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 50,
    borderColor: '#ced4da',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  gridTitle: {
    fontSize: 20,
    margin: 0,
    fontWeight: 'bold',
    color: '#666699',
  },
  gridContainer: {
    paddingHorizontal: 20,
  },
  colaboradorCard: {
    padding: 15,
    marginTop: 10,
    marginBottom: 10,
    borderColor: '#666699',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    backgroundColor: '#e0e0eb'
  },
  colaboradorNome: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  colaboradorDescricao: {
    color: '#555',
  },
});

export default Servicos;