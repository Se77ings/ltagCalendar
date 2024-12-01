import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { AtualizarMensagemAsync, ObterMensagemAsync, ObterMensagemFormatadaAsync } from '../../services/mensagemService';
import { Button, useTheme } from 'react-native-paper';

export default function DetalhesAtendimento() {

  const { theme, toggleTheme } = useTheme();
  const textColor = theme === "dark" ? "white" : "white";
  const textColor2 = theme === "dark" ? "white" : "black";
  const FundoThema = theme === "dark" ? "#020C2A" : "red";
  const transparentBG = theme === "dark" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.8)";

  const [texto, setTexto] = useState('');
  const [variaveis, setVariaveis] = useState([
    { id: '1', nome: 'Nome' },
    { id: '2', nome: 'Serviço' }, //TODO: fazer a lógica para obter serviço
    { id: '3', nome: 'Data' },
    { id: '4', nome: 'Hora' },
  ]);
  const [exibirSugestoes, setExibirSugestoes] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);  

  useEffect(() => {
    async function carregarMensagem() {
      const resposta = await ObterMensagemAsync();
      if (resposta.success && resposta.data) {
        setTexto(resposta.data);
        console.log(texto);
      } else {
        setTexto("Erro ao carregar mensagem.");
      }
    }

    carregarMensagem();
  }, []);

  function handleInputChange(input) {
    setTexto(input);
    if (input.includes('@')) {
      setExibirSugestoes(true);
      setModalVisible(true); 
    } else {
      setExibirSugestoes(false);
      setModalVisible(false); 
    }
  }

  function inserirVariavel(variavel) {
    const novoTexto = texto.replace('@', '{' + variavel + '}');
    setTexto(novoTexto);
    setExibirSugestoes(false);
    setModalVisible(false);
  }

  async function atualizarMensagemBanco() {
    const resposta = await AtualizarMensagemAsync(texto);
    if (resposta.success) {
      alert("Mensagem atualizada com sucesso!");
    } else {
      alert("Erro ao atualizar a mensagem: " + resposta.error);
    }
  }

  async function limparMensagem() {
    setTexto('');
  }

  async function formatarMensagem() {    
    var msgFormatado = await ObterMensagemFormatadaAsync(atendimento);
    console.log(msgFormatado.data);
    setTexto(msgFormatado.data);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 15 }}>
          Mensagem
        </Text>       
        <TextInput
          value={texto}
          onChangeText={handleInputChange}
          placeholder="Digite sua mensagem"
          multiline={true}
          numberOfLines={5}
          style={{ height: 100, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 8 }}
        />
        
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
          <Button
            mode="contained"
            onPress={atualizarMensagemBanco}
            style={{ paddingVertical: 10, backgroundColor: "#2F407A", flex: 1 }}
            labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
          >
            Salvar
          </Button>

          <Button
            mode="contained"
            onPress={limparMensagem}
            style={{ paddingVertical: 10, backgroundColor: "#2F407A", flex: 1 }}
            labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
          >
            Limpar
          </Button>
        </View>

        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: transparentBG }}>
            <View style={{ width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>
              Variáveis
            </Text> 

              <FlatList
                data={variaveis}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => inserirVariavel(item.nome)}>
                    <Text style={{ padding: 10, backgroundColor: '#f0f0f0', marginBottom: 5 }}>
                      {item.nome}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          </View>
        </Modal>

      </View>
    </KeyboardAvoidingView>
  );
}
