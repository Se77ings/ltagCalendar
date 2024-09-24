import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FloatingLabelInput } from 'react-native-floating-label-input';

import { StyleSheet, Text, View, Button, TextInput, Pressable} from "react-native";
import * as Yup from 'yup';
import { Formik } from 'formik'; 
import adicionarAgendamento from "../../services/agendamentoService";

const Validation = Yup.object().shape({
  Nome: Yup.string()
    .min(3, 'Minimo de 3 caracteres!')
    .max(50, 'Máximo de 50 caracteres!')
    .required('Obrigatorio'),
    
    Telefone: Yup.string()
    .matches(/^\d{10,11}$/, 'O telefone deve ter 10 ou 11 dígitos e conter apenas números')
    .required('Obrigatório'),

    Data: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'A data deve estar no formato DD/MM/YYYY.')
    .required('Campo obrigatório.'),
  
  // Hora: Yup.string()
  //   .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'A hora deve estar no formato HH:mm.')
  //   .required('Campo obrigatório.'),
    
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



export default function NovoAgendamento({ fecharModal }) {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [DateString, setDateString] = useState(date.toISOString().split('T')[0]);


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setDateString(currentDate.toISOString().split('T')[0]);
  };

  //time
  const [time, setTime] = useState(new Date());  
  const [showtime, setShowtime] = useState(false);
  const [timeString, setTimeString] = useState(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

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
      onSubmit={(values) => criarAgendamento(fecharModal, values.Nome, values.Telefone, DateString, timeString, values.Prestador, values.Servico)}

    >
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => (

        
        <View style={styles.container}> 
          <View style={styles.inputContainer}>
            <FloatingLabelInput
              style={styles.input}
              labelStyles={{ backgroundColor: "white", paddingHorizontal:10}}
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
              labelStyles={{ backgroundColor: "white", paddingHorizontal:10}}
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
            value={date.toLocaleDateString()}
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
              value={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              editable={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <FloatingLabelInput
              labelStyles={{ backgroundColor: "white", paddingHorizontal:10}}
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
              labelStyles={{ backgroundColor: "white", paddingHorizontal:10,}}
              onChangeText={handleChange('Servico')}
              value={values.Servico}
              label="Servico"
            />
            {errors.Servico && touched.Servico ? (
              <Text style={styles.error}>{errors.Servico}</Text>
            ) : null}
          </View>

          <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between" }}>
              <Button
              title="Cadastrar validação"
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
