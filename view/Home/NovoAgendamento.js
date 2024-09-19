import React from "react";
import { View, Text, Button, TextInput } from "react-native";
import adicionarAgendamento from "../../services/agendamentoService";

//Para teste em console.Log, remover após implementar o front
function agendamentoMock() {
  return {
    nome: "Teste Silva",
    telefone: "11987654321",
    dataHora: "2024-09-30 14:00",
    servico: "Corte de Cabelo",
    prestador: "Carlos",
  };
}

async function criarAgendamento(fecharModal) {
  try {
    const agendamento = agendamentoMock(); //usar o formulário para pegar os dados após implementar
    await adicionarAgendamento(agendamento);
    console.log("Sucesso", "Agendamento cadastrado com sucesso!");

    fecharModal();
  } catch (error) {
    console.error("Erro ao inserir o agendamento mockado:", error);
  }
}

export default function NovoAgendamento({ fecharModal }) {
  return (
    <View style={{ backgroundColor: "white", alignSelf: "center", width: "90%", padding: 30, borderRadius: 20 }}>
      <Text>Nome do Cliente:</Text>
      <TextInput style={{ borderWidth: 1, borderColor: "black", borderRadius: 5, padding: 5 }} />
      <Text>Telefone:</Text>
      <TextInput style={{ borderWidth: 1, borderColor: "black", borderRadius: 5, padding: 5 }} />
      <Text>Data:</Text>
      <TextInput style={{ borderWidth: 1, borderColor: "black", borderRadius: 5, padding: 5 }} />
      <Text>Hora:</Text>
      <TextInput style={{ borderWidth: 1, borderColor: "black", borderRadius: 5, padding: 5 }} />
      <Text>Serviço:</Text>
      <TextInput style={{ borderWidth: 1, borderColor: "black", borderRadius: 5, padding: 5 }} />
      <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between" }}>
        <Button title="Limpar Campos" />
        <Button
          title="Cadastrar (mockado)"
          onPress={() => {
            criarAgendamento(fecharModal); 
          }}
        />
      </View>
    </View>
  );
}
