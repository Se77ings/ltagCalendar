import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, Modal, Pressable, Alert } from "react-native";
import NovoAgendamento from "./NovoAgendamento";
import { useNavigation } from "@react-navigation/native";

import { createStackNavigator } from "@react-navigation/stack";
import initializaDatabase from "../../database/initializeDatabase";
import { AtualizarAgendamentoAsync, ObterAgendamentosPaginadoAsync } from "../../services/agendamentoService";

export default function Home() {
  const Stack = createStackNavigator();
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  
  const initialize = async () => {
    try {
      await initializaDatabase();
      console.log('Banco de dados inicializado com sucesso.');
    } catch (error) {
      console.error('Erro ao inicializar o banco de dados:', error);
    }
  };
  
  useEffect(() => {  
    initialize(); 
  }, []); 

  
  async function obterTodos() {
      const resut = await ObterAgendamentosPaginadoAsync(1, 5); //primeiro parâmetro página e segundo quantidade por página

      for (const row of resut.data) { //exibir em tela apos implementar, por enquanto só log para teste
        console.log(row.id, row.Nome, row.DataHora);
      }    
    }

   
  //Para teste em console.Log, remover após implementar o front
function agendamentoMock() {
  return {
    id: 2,
    nome: "Teste Alteracao2",
    telefone: "11987654999",
    dataHora: "2024-09-30 14:00",
    servico: "Corte de Barba"    
  };
}

async function atualizarAgendamento() {
  try {
    const agendamento = agendamentoMock(); //usar o formulário para pegar os dados após implementar
    await AtualizarAgendamentoAsync(agendamento); 

  } catch (error) {
    console.error("Erro ao alterar o agendamento mockado:", error);
  }
}
  function Main() {
    return (
      <View style={styles.container}>
         <Button
          title="Teste Atualizar" //TODO: apenas para teste, remover
          onPress={() => {
            atualizarAgendamento();
          }}
        />     
        <Button
          title="Teste Obter" //TODO: apenas para teste, remover
          onPress={() => {
            obterTodos();
          }}
        />
        <Button
          title="Novo Agendamento"
          onPress={() => {
            setVisible(true);
          }}
        />
        <Modal visible={visible} transparent={true}>
          <Pressable
            onPress={() => {
              setVisible(false);
            }}
            style={{ height: "100%", backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center" }}>
          <NovoAgendamento fecharModal={() => setVisible(false)} />
          </Pressable>
        </Modal>
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen name="Main" component={Main} options={{headerShown:false}} />
      <Stack.Screen name="NovoAgendamento" component={NovoAgendamento} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo o espaço da tela
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
