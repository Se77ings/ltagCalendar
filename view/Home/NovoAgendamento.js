import React, { useState, useRef } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StyleSheet, Text, View, Button, TextInput, Pressable} from "react-native";
import * as Yup from 'yup';
import { Formik } from 'formik'; 
import adicionarAgendamento from "../../services/agendamentoService";
import CriarAgendamento from '../../database/agendamentoRepository';

const Validation = Yup.object().shape({
  Nome: Yup.string()
    .min(3, 'Minimo de 3 caracteres!')
    .max(50, 'Máximo de 50 caracteres!')
    .required('Obrigatorio'),
    
  // Telefone: Yup.number()
  //   .typeError('Apenas números inteiros')
  //   .positive('O numero tem que ser positivo')
  //   .min(10000000000, 'Minimo de 11 caracteres!')
  //   .max(999999999999, 'Máximo de 11 caracteres!')
  //   .required('Obrigatorio'),

  //   Data: Yup.string()
  //   .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, 'A data deve estar no formato DD/MM/YYYY.')
  //   .required('Campo obrigatório.'),
  
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
    console.log("Agendamento mockado:", agendamento);
    await adicionarAgendamento(agendamento);
    console.log("Sucesso", "Agendamento cadastrado com sucesso!");
    fecharModal();
  } catch (error) {
    console.error("Erro ao inserir o agendamento mockado:", error);
  }
}



export default function NovoAgendamento({ fecharModal }) {
  const inputRefs = useRef({});

  const focusInput = (field) => {
    inputRefs.current[field]?.focus();
  };

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
      onSubmit={(values) => criarAgendamento(fecharModal, values.Nome, values.Telefone, DateString, timeString, values.Prestador, values.Servico)}

    >
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => (
        <View style={styles.container}>  
          <Pressable onPress={() => focusInput('Nome')}>
            <Text style={styles.label}>Nome</Text>
          </Pressable>        
          <TextInput
            ref={(ref) => (inputRefs.current.Nome = ref)}
            style={styles.input}
            onChangeText={handleChange('Nome')}
            onBlur={handleBlur('Nome')}
            value={values.Nome}
            placeholder="Nome"
          />
          {errors.Nome && touched.Nome ? (
             <Text style={styles.error}>{errors.Nome}</Text>
           ) : null}
          
          <Pressable onPress={() => focusInput('Telefone')}>
            <Text style={styles.label}>Telefone</Text>
          </Pressable>        
          <TextInput
            ref={(ref) => (inputRefs.current.Telefone = ref)}
            style={styles.input}
            onChangeText={handleChange('Telefone')}
            onBlur={handleBlur('Telefone')}
            value={values.Telefone}
            placeholder="exemplo: 17997556141"
            keyboardType="numeric"
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
          <TextInput
            style={styles.input}
            onChangeText={handleChange('Hora')}
            onBlur={handleBlur('Hora')}
            value={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            placeholder="Hora"
            editable={false}
          />


          <Pressable onPress={() => focusInput('Prestador')}>
            <Text style={styles.label}>Prestador</Text>
          </Pressable>        
          <TextInput
            ref={(ref) => (inputRefs.current.Prestador = ref)}
            style={styles.input}
            onChangeText={handleChange('Prestador')}
            onBlur={handleBlur('Prestador')}
            value={values.Prestador}
            placeholder="Prestador"
          />
          {errors.Prestador && touched.Prestador ? (
             <Text style={styles.error}>{errors.Prestador}</Text>
           ) : null}

          <Pressable onPress={() => focusInput('Servico')}>
            <Text style={styles.label}>Servico</Text>
          </Pressable>        
          <TextInput
            ref={(ref) => (inputRefs.current.Servico = ref)}
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
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
});
