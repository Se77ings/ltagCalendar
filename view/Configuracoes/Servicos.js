import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Button, ScrollView, FlatList, StyleSheet, Alert, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../../assets/components/Header";

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

    // Animação para esconder o formulário
    Animated.timing(formAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setShowForm(false);
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

  const renderColaborador = ({ item }) => (
    <View style={styles.colaboradorCard}>
      <Text style={styles.colaboradorNome}>{item.nome}</Text>
      <Text style={styles.colaboradorDescricao}>{item.descricao}</Text>
    </View>
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
      handleSubmit();
    }
  };

  const formHeight = formAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300], // Ajuste a altura conforme necessário
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View style={{ height: formHeight, overflow: 'hidden' }}>
          {showForm && (
            <>
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
            </>
          )}
        </Animated.View>

        <Text style={styles.gridTitle}>Colaboradores Cadastrados:</Text>
        <FlatList
          data={colaboradores}
          renderItem={renderColaborador}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.gridContainer}
        />
      </ScrollView>
      <View style={{ margin: 10 }}>
        <Button
          title={showForm ? "Salvar" : "Cadastrar"}
          color={'#007bff'}
          onPress={toggleForm}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    paddingTop: 25,
  },
  Header: {
    width: '100%',
    alignItems: 'center'
  },
  scrollContainer: {
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
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
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  gridTitle: {
    fontSize: 18,
    margin: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  gridContainer: {
    paddingHorizontal: 20,
  },
  colaboradorCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    borderColor: '#ced4da',
    borderWidth: 1,
    marginBottom: 10,
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
