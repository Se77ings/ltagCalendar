import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import * as Yup from 'yup';
import { Formik } from 'formik'; 
import adicionarAgendamento from "../../services/agendamentoService";

const Validation = Yup.object().shape({
  Nome: Yup.string()
    .min(3, 'Minimo de 3 caracteres!')
    .max(50, 'Máximo de 50 caracteres!')
    .required('Obrigatorio'),
    
  Telefone: Yup.number()
    .typeError('Apenas números inteiros')
    .positive('O numero tem que ser positivo')
    .min(10000000000, 'Minimo de 11 caracteres!')
    .max(999999999999, 'Máximo de 11 caracteres!')
    .required('Obrigatorio'),
    
  Prestador: Yup.string()
    .min(3, 'Minimo de 3 caracteres!')
    .max(50, 'Máximo de 50 caracteres!')
    .required('Obrigatorio'),

  DataHora: Yup.date().required('Obrigatorio'),
  
  Servico: Yup.string()
    .min(3, 'Minimo de 3 caracteres!')
    .max(50, 'Máximo de 50 caracteres!')
    .required('Obrigatorio'),
});

async function criarAgendamento(fecharModal) {
  try {
    const agendamento = {
      nome: "Te",
      telefone: "11987654321",
      DataHora: new Date(), // Ajuste conforme necessário
      servico: "Corte de Cabelo",
      prestador: "Carlos",
    };
    await adicionarAgendamento(agendamento);
    console.log("Sucesso", "Agendamento cadastrado com sucesso!");
    fecharModal();
  } catch (error) {
    console.error("Erro ao inserir o agendamento mockado:", error);
  }
}

export default function NovoAgendamento({ fecharModal }) {
  const [date, setDate] = useState(new Date());

  return (
    <Formik 
      initialValues={{
        Nome: '',
        Telefone: '',
        DataHora: '',
        Prestador: '',
        Servico: ''
      }}
      validationSchema={Validation}
      onSubmit={values => console.log(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => (
        <View style={styles.container}>

          <TextInput
            style={styles.input}
            onChangeText={handleChange('Nome')}
            onBlur={handleBlur('Nome')}
            value={values.Nome}
            placeholder="Nome"
          />
          {errors.Nome && touched.Nome ? (
             <Text style={styles.error}>{errors.Nome}</Text>
           ) : null}

          <TextInput
            style={styles.input}
            onChangeText={handleChange('Telefone')}
            onBlur={handleBlur('Telefone')}
            value={values.Telefone}
            placeholder="exemplo: 17997556141"
            keyboardType="numeric" // Adiciona a entrada numérica
          />
          {errors.Telefone && touched.Telefone ? (
             <Text style={styles.error}>{errors.Telefone}</Text>
           ) : null}

          <TextInput
            style={styles.input}
            onChangeText={handleChange('DataHora')}
            onBlur={handleBlur('DataHora')}
            value={values.DataHora}
            placeholder="DataHora"
          />
          {errors.DataHora && touched.DataHora ? (
             <Text style={styles.error}>{errors.DataHora}</Text>
           ) : null}

          <TextInput
            style={styles.input}
            onChangeText={handleChange('Prestador')}
            onBlur={handleBlur('Prestador')}
            value={values.Prestador}
            placeholder="Prestador"
          />
          {errors.Prestador && touched.Prestador ? (
             <Text style={styles.error}>{errors.Prestador}</Text>
           ) : null}

          <TextInput
            style={styles.input}
            onChangeText={handleChange('Servico')}
            onBlur={handleBlur('Servico')}
            value={values.Servico}
            placeholder="Serviço"
          />
          {errors.Servico && touched.Servico ? (
             <Text style={styles.error}>{errors.Servico}</Text>
           ) : null}

          <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between" }}>
            <Button onPress={handleSubmit} title="Enviar dados" />
            <Button
              title="Cadastrar (mockado)"
              onPress={() => criarAgendamento(fecharModal)}
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
  error: {
    color: "red",
    padding: 0,
    marginTop: -9,
    marginBottom: 10,
  },
});
