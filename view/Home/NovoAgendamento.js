import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FloatingLabelInput } from 'react-native-floating-label-input';

import { StyleSheet, Text, View, Button, TextInput, Alert } from "react-native";
import * as Yup from 'yup';
import { Formik } from 'formik';
import adicionarAgendamento, { AtualizarAgendamentoAsync } from "../../services/agendamentoService";
import { AtualizarAgendamento } from '../../database/agendamentoRepository';

const Validation = Yup.object().shape({
  Nome: Yup.string()
    .min(3, 'Minimo de 3 caracteres!')
    .max(50, 'Máximo de 50 caracteres!')
    .required('Obrigatorio'),

  // Telefone: Yup.string()
  // .matches(/^\d{10,11}$/, 'O telefone deve ter 10 ou 11 dígitos e conter apenas números')
  // .required('Obrigatório'),

  Prestador: Yup.string()
    .min(3, 'Minimo de 3 caracteres!')
    .max(50, 'Máximo de 50 caracteres!'),

  Servico: Yup.string()
    .min(3, 'Minimo de 3 caracteres!')
    .max(50, 'Máximo de 50 caracteres!')
    .required('Obrigatorio'),
});

async function criarAgendamento(fecharModal, nome, telefone, data, hora, prestador, servico) {
  try {
    const agendamento = {
      nome,
      telefone,
      data,
      hora,
      prestador,
      servico,
    };
    console.log("Agendamento:", agendamento);
    var res = await adicionarAgendamento(agendamento);
    console.log("Resposta:", res);
    // console.log("Sucesso", "Agendamento cadastrado com sucesso!");
    fecharModal();
  } catch (error) {
    console.error("Erro ao inserir o agendamento:", error);

  }
}



export default function NovoAgendamento({ fecharModal, EditAgendamento }) {
  const [agendamento, setAgendamento] = useState(null);

  useEffect(() => {
    // Verifica se EditAgendamento não está vazio
    if (EditAgendamento) {
      // Lógica a ser executada quando EditAgendamento tem valor
      setDate(new Date(EditAgendamento.Data)); // Definindo o estado da data
      setTime(new Date(`1970-01-01T${EditAgendamento.Hora}:00`)); // Definindo o estado da hora
      setDateString(EditAgendamento.Data); // Atualiza a string da data
      setTimeString(EditAgendamento.Hora); // Atualiza a string da hora
    } else {
      // Lógica a ser executada quando EditAgendamento está vazio
      console.log("Nenhum agendamento para editar.");
      setDate(new Date()); // Reseta para a data atual
      setTime(new Date()); // Reseta para a hora atual
      setDateString(new Date().toISOString().split('T')[0]); // Define a string da data atual
      setTimeString(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); // Define a string da hora atual
    }
  }, [EditAgendamento]);

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [DateString, setDateString] = useState(date.toISOString().split('T')[0]);


  const [time, setTime] = useState(new Date());
  const [showtime, setShowtime] = useState(false);
  const [timeString, setTimeString] = useState(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setDateString(currentDate.toISOString().split('T')[0]);
  };
  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowtime(false);
    setTime(currentTime);
    setTimeString(currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };


  const initialValues = {
    Nome: EditAgendamento?.Nome || '',
    Telefone: EditAgendamento?.Telefone || '',
    Data: EditAgendamento?.Data || date.toLocaleDateString('en-CA'),
    Hora: EditAgendamento?.Hora || time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    Prestador: EditAgendamento?.Prestador || '',
    Servico: EditAgendamento?.Servico || '',
  };

  async function sendUpdate (){
    const result = await AtualizarAgendamentoAsync({
      id: EditAgendamento.Id,
      nome: EditAgendamento.Nome,
      telefone: EditAgendamento.Telefone,
      data: DateString,
      hora: timeString,
      prestador: EditAgendamento.Prestador,
      servico: EditAgendamento.Servico
    });
    if(result.success){
      Alert.alert('Sucesso', 'Agendamento atualizado com sucesso!');
      fecharModal();
    } else {
      Alert.alert('Erro', 'Erro ao atualizar o agendamento');
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Validation}
      onSubmit={(values) => {
        EditAgendamento ? sendUpdate() : criarAgendamento(fecharModal, values.Nome, values.Telefone, DateString, timeString, values.Prestador, values.Servico)
      }}

    >
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => (


        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <FloatingLabelInput
              style={styles.input}
              labelStyles={{ backgroundColor: "white", paddingHorizontal: 10 }}
              onChangeText={handleChange('Nome')}
              value={values.Nome}
              label="Nome"
            />
            {errors.Nome && touched.Nome ? (
              <Text style={styles.error}>{errors.Nome}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <FloatingLabelInput
              style={styles.input}
              labelStyles={{ backgroundColor: "white", paddingHorizontal: 10 }}
              onChangeText={handleChange('Telefone')}
              value={values.Telefone}
              label="Telefone"
              keyboardType="numeric"
            />
            {errors.Telefone && touched.Telefone ? (
              <Text style={styles.error}>{errors.Telefone}</Text>
            ) : null}
          </View>


          <Button title="Data" onPress={() => setShow(true)} />
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date" // Modo de data
              is24Hour={true}
              display="calendar"
              onChange={onChange}
            />
          )}
          <TextInput
            style={styles.input}
            onChangeText={handleChange('date')}
            value={DateString}
            editable={false} // Impedir edição manual
          />

          <Button title="Hora" onPress={() => setShowtime(true)} />
          {showtime && (
            <DateTimePicker
              value={time}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={onChangeTime}
            />
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('Hora')}
              value={timeString}
              editable={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <FloatingLabelInput
              labelStyles={{ backgroundColor: "white", paddingHorizontal: 10 }}
              onChangeText={handleChange('Prestador')}
              value={values.Prestador}
              label="Prestador"
            />
            {errors.Prestador && touched.Prestador ? (
              <Text style={styles.error}>{errors.Prestador}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <FloatingLabelInput
              labelStyles={{ backgroundColor: "white", paddingHorizontal: 10, }}
              onChangeText={handleChange('Servico')}
              value={values.Servico}
              label="Servico"
            />
            {errors.Servico && touched.Servico ? (
              <Text style={styles.error}>{errors.Servico}</Text>
            ) : null}
          </View>

          <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "center" }}>
            <Button
              title={EditAgendamento ? "Editar" : "Cadastrar"}
              onPress={handleSubmit} // Chama o handleSubmit para validar o formulário
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
    textAlign: 'center',
    height: 40,
    fontSize: 20,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  inputContainer: {
    marginBottom: 10,
  },
  error: {
    color: "red",
    padding: 0,
    marginTop: 2,
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
});
