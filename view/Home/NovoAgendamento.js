import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import * as Yup from 'yup';
import { Formik } from 'formik'; 
import adicionarAgendamento from "../../services/agendamentoService";
import CriarAgendamento from '../../database/agendamentoRepository';

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
    console.log("Agendamento mockado:", agendamento);
    await adicionarAgendamento(agendamento);
    console.log("Sucesso", "Agendamento cadastrado com sucesso!");
    fecharModal();
  } catch (error) {
    console.error("Erro ao inserir o agendamento mockado:", error);
  }
}



export default function NovoAgendamento({ fecharModal }) {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [DateString, setDateString] = useState('');


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setDateString(currentDate.toLocaleDateString('pt-BR'));
  };

  //time
  const [time, setTime] = useState(new Date());  
  const [showtime, setShowtime] = useState(false);
  const [timeString, setTimeString] = useState('');

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowtime(false);
    setTime(currentTime);
    setTimeString(currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };


  //fim time

  return (
    <Formik 
      initialValues={{
        Nome: '',
        Telefone: '',
        Data: '',
        Hora: '',
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


          <Button title="Data" onPress={() => setShow(true)} />
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date" // Modo de data
              is24Hour={true}
              display="spinner"
              onChange={onChange}
            />
          )}
            <TextInput
            style={styles.input}
            onChangeText={handleChange('date')}
            onBlur={handleBlur('date')}
            value={date.toLocaleDateString()}
            editable={true} // Impedir edição manual
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
          <TextInput
            style={styles.input}
            onChangeText={handleChange('Hora')}
            onBlur={handleBlur('Hora')}
            value={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            placeholder="Hora"
          />
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
          <Button
            title="Cadastrar (mockado)"
            onPress={() => criarAgendamento(fecharModal, values.Nome, values.Telefone, DateString, timeString, values.Prestador, values.Servico)}
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
