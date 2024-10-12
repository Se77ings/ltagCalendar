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
  const formAnimation = useRef(new Animated.Value(0)).current; // Inicializa o valor da animação

  const handleSubmit = () => {
    if (!nome || !descricao) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    Alert.alert("Sucesso", "Serviço cadastrado com sucesso!");
    setNome("");
    setDescricao("");
    setColaboradores(prev => [...prev, { id: colaboradores.length + 1, nome, descricao }]);

    EscodeForm();
  };

  const EscodeForm = () => {
    Animated.timing(formAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setShowForm(false);
    });
  }

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

  const renderColaborador = ({ item }) => (
    <View style={styles.colaboradorCard}>
      <View>
        <Text style={styles.colaboradorNome}>{item.nome}</Text>
        <Text style={styles.colaboradorDescricao}>{item.descricao}</Text>
      </View>
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 12, color:'#276000'}}>Clique para editar</Text>
        {/* <Button title="Editar" color={'#666699'} onPress={() => navigation.navigate("EditarColaborador", { colaborador: item })} /> */}
      </View>
    </View>
  );

  const toggleForm = (close) => {
    if (!showForm) {
      setShowForm(true);
      // Animação para mostrar o formulário
      Animated.timing(formAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      if(close){
      }
      handleSubmit();
    }
  };

  const formHeight = formAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250], 
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View style={{width:'90%', height: formHeight, overflow: 'hidden' }}>
          {showForm && (
            <View style={{borderWidth: 2, borderColor:'#666699', borderRadius:20, padding:20, backgroundColor:'#c2c2d6'}}>
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

              <Text style={styles.label}>Descrição:</Text>
              <TextInput
                style={styles.textArea}
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Insira a descrição do serviço"
                multiline
                numberOfLines={4}
              />
            </View>
          )}
        </Animated.View>

        <Text style={styles.gridTitle}>Colaboradores Cadastrados:</Text>
        <FlatList
          data={colaboradores}
          renderItem={renderColaborador}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.gridContainer}
          style={{ width: '90%', backgroundColor: '#a3a3c2',borderRadius:15}}
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
        onPress={toggleForm}
      >
        <Text style={{ color: 'white' }}>
          {showForm ? "Salvar" : "Cadastrar"}
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
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
   },
  textArea: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
    backgroundColor: '#fff',
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
    borderWidth: 1,
    marginTop: 15,
    borderColor:'#666699', 
    borderRadius:10, 
    padding:20, 
    width: '100%',
    backgroundColor:'#e0e0eb'
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
