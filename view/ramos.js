//Tela para testar métodos de cadastro de ramo (precisa corrigir e acoplar nas boas vindas e serviços)

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { cadastrarServicosPorRamo, ramosDeAtividade } from '../services/ramoService';
import adicionarEstabelecimentoAsync, { AtualizarEstabelecimentoAsync, ObterEstabelecimentoAsync } from '../services/estabelecimentoService';

export default function EscolherRamo() {
  const [ramoEscolhido, setRamoEscolhido] = useState(null); 
  
  const handleEscolherRamo = async (ramoId) => {
    try {
      setRamoEscolhido(ramoId); 
      await cadastrarServicosPorRamo(ramoId); 
      Alert.alert("Sucesso!", `Serviços para o ramo ${ramosDeAtividade.find(ramo => ramo.id === ramoId).nome} cadastrados com sucesso.`);
    } catch (error) {
      console.error("Erro ao cadastrar serviços:", error);
      Alert.alert("Erro", "Ocorreu um erro ao cadastrar os serviços.");
    }
  };
  const handleEstabelecimento = async () => {
    const estabelecimento = {
      id: 1,
      nome: 'Alteracao XYZ',
      telefone: '22345678901',
      endereco: 'Rua da Alteracao, 123',
      logo: null 
    }; 

    await AtualizarEstabelecimentoAsync(estabelecimento);
  }

  const handleObterEstabelecimento = async () => {
    
    var a = await ObterEstabelecimentoAsync();
    console.log(a);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha o Ramo de Atividade</Text>

      {ramosDeAtividade.map((ramo) => (
        <Button
          key={ramo.id}
          title={ramo.nome}
          onPress={() => handleEscolherRamo(ramo.id)} 
        />
      ))}

      {ramoEscolhido && (
        <Text style={styles.selectedRamo}>
          Ramo escolhido: {ramosDeAtividade.find(ramo => ramo.id === ramoEscolhido)?.nome}
        </Text>
      )}

      <Button onPress={() => handleEstabelecimento() } title='Testar Estabelecimento'></Button>

      <Button onPress={() => handleObterEstabelecimento() } title='Obter Estabelecimento'></Button>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  selectedRamo: {
    marginTop: 20,
    fontSize: 18,
    color: 'green',
  },
});
