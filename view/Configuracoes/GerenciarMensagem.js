import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, Button } from "react-native";
import { AtualizarMensagemAsync, ObterMensagemAsync, ObterMensagemFormatadaAsync } from "../../services/mensagemService";
import { useTheme } from "../../ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function DetalhesAtendimento() {
  const { theme, toggleTheme } = useTheme();
  const textColor = theme === "dark" ? "white" : "black";
  const textColor2 = theme === "dark" ? "white" : "black";
  const FundoThema = theme === "dark" ? "#020C2A" : "red";
  const transparentBG = theme === "dark" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.8)";

  const [texto, setTexto] = useState("");
  const [variaveis, setVariaveis] = useState([
    { id: "1", nome: "Nome" },
    { id: "2", nome: "Serviço" }, //TODO: fazer a lógica para obter serviço
    { id: "3", nome: "Data" },
    { id: "4", nome: "Hora" },
  ]);
  const [exibirSugestoes, setExibirSugestoes] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalHelp, setModalHelp] = useState(false);

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
    if (input.includes("@")) {
      setExibirSugestoes(true);
      setModalVisible(true);
    } else {
      setExibirSugestoes(false);
      setModalVisible(false);
    }
  }

  function inserirVariavel(variavel) {
    const novoTexto = texto.replace("@", "{" + variavel + "}");
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
    setTexto("");
  }

  async function formatarMensagem() {
    var msgFormatado = await ObterMensagemFormatadaAsync(atendimento);
    console.log(msgFormatado.data);
    setTexto(msgFormatado.data);
  }

  const showHelp = () => {
    setModalHelp(true);
  };

  return (
    <View style={{ padding: 20 }}>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 15, color: textColor, textAlign: "center" }}>Mensagem</Text>
        <Ionicons name="help-circle-outline" size={30} color={textColor} style={{ marginLeft: 10 }} onPress={showHelp} />
      </View>
      <TextInput value={texto} onChangeText={handleInputChange} placeholder="Digite sua mensagem" multiline={true} numberOfLines={5} style={{ borderColor: "gray", borderWidth: 1, marginBottom: 10, paddingLeft: 8, color: textColor, verticalAlign: "top", padding: 5 }} />

      <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
        {/* <Button title="Salvar" onPress={atualizarMensagemBanco} style={{ paddingVertical: 10, backgroundColor: "#2F407A", flex: 1 }} labelStyle={{ fontSize: 16, fontWeight: "bold" }}/>
        <Button title="Limpar" onPress={limparMensagem} style={{ paddingVertical: 10, backgroundColor: "#2F407A", flex: 1 }} labelStyle={{ fontSize: 16, fontWeight: "bold" }}/> */}
        <TouchableOpacity onPress={atualizarMensagemBanco} style={{ paddingVertical: 10, backgroundColor: "#2F407A", flex: 1, borderRadius: 10 }}>
          <Text style={{ textAlign: "center", color: "white", fontSize: 16, fontWeight: "bold" }}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={limparMensagem} style={{ paddingVertical: 10, backgroundColor: "#2F407A", flex: 1, borderRadius: 10 }}>
          <Text style={{ textAlign: "center", color: "white", fontSize: 16, fontWeight: "bold" }}>Limpar</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent={true} visible={modalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: transparentBG }} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <TouchableOpacity style={{ width: "80%", backgroundColor: "white", padding: 20, borderRadius: 10 }} activeOpacity={1}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>Variáveis</Text>

            <FlatList
              data={variaveis}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => inserirVariavel(item.nome)}>
                  <Text style={{ padding: 10, backgroundColor: "#f0f0f0", marginBottom: 5 }}>{item.nome}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      <Modal transparent={true} visible={modalHelp} animationType="fade" onRequestClose={() => setModalHelp(false)}>
        <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: transparentBG }} activeOpacity={1} onPress={() => setModalHelp(false)}>
          <TouchableOpacity style={{ width: "80%",  backgroundColor: textColor == "white" ? "#00002b" : "white", padding: 20, borderRadius: 10 }} activeOpacity={1}>
            <Text style={{color:textColor, fontSize:15}}>Aqui voce pode personalizar sua mensagem.</Text>
            <Text style={{color:textColor, fontSize:15}}>Digite um '@' no campo de texto abaixo, para ter acesso aos dados que deseja inserir na sua mensagem</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
