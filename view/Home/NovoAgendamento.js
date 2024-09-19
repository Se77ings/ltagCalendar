import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, Modal, Pressable, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik' ; 
import adicionarAgendamento from "../../services/agendamentoService";

const SignupSchema = Yup.object().shape({
  Nome: Yup.string()
    .min(3, 'Minimo de 3 caracteres!')
    .max(50, 'Máximo de 50 caracteres!')
    .required('Obrigatorio'),
  Telefone: Yup.number('Apenas numeros').integer()
    .required('Required'),
  Prestador: Yup.string()
    .min(3, 'Minimo de 3 caracteres!')
    .max(50, 'Máximo de 50 caracteres!')
    .required('Obrigatorio'),
 
  Servico: Yup.string()
    .min(3, 'Minimo de 3 caracteres!')
    .max(50, 'Máximo de 50 caracteres!')
    .required('Obrigatorio'),
});

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


export default function NovoAgendamento() {
  // Dados obrigatórios: Nome do cliente, Telefone, data e horário, serviço a ser realizado;
  // sugestão: https://formik.org/docs/guides/react-native

  //https://npmjs.com/package/yup
  //https://www.npmjs.com/package/react-native-floating-label-input?activeTab=readme
  //https://www.npmjs.com/package/react-native-date-picker
  return (
    <Formik 
      initialValues={{
        Nome: '',
        Telefone: '',
        Data:'',
        Hora:'',
        Prestador:'',
        Servico:''}}
      onSubmit={values => console.log(values)}
    >

    {({ handleChange, handleBlur, handleSubmit, values })=> 
      (
        <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={handleChange('Nome')}
          onBlur={handleBlur('Nome')}
          value={values.Nome}
          placeholder="Nome"
        />
        {/* {touched.nome && errors.nome && <Text style={styles.error}>{errors.nome}</Text>} */} 
        <TextInput
          style={styles.input}
          onChangeText={handleChange('Telefone')}
          onBlur={handleBlur('Telefone')}
          value={values.Telefone}
          placeholder="Telefone"
        />
        <TextInput
          style={styles.input}
          onChangeText={handleChange('Data')}
          onBlur={handleBlur('Data')}
          value={values.Data}
          placeholder="Data"
        />
        <TextInput
          style={styles.input}
          onChangeText={handleChange('Hora')}
          onBlur={handleBlur('Hora')}
          value={values.Hora}
          placeholder="Hora"
        />
        <TextInput
          style={styles.input}
          onChangeText={handleChange('Prestador')}
          onBlur={handleBlur('Prestador')}
          value={values.Prestador}
          placeholder="Prestador"
        />
        <TextInput
          style={styles.input}
          onChangeText={handleChange('Servico')}
          onBlur={handleBlur('Servico')}
          value={values.Servico}
          placeholder="Serviço"
        />
        <View style={{ marginTop: 10, flexDirection:"row", justifyContent:"space-between" }}>
          <Button onPress={handleSubmit} title="Enviar dados" />
          <Button
            title="Cadastrar (mockado)"
            onPress={() => {
              criarAgendamento(fecharModal); 
          }}
        />
        </View>
        
      </View>

      )}

      
    
    </Formik>
    
  );

}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white", alignSelf: "center", width: "90%", padding: 30, borderRadius: 20
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
})