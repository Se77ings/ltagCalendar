import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { Picker } from '@react-native-picker/picker';


import { StyleSheet, Text, View, Button, TextInput, Alert } from "react-native";
import * as Yup from 'yup';
import { Formik } from 'formik';
import adicionarAgendamento, { AtualizarAgendamentoAsync } from "../../services/agendamentoService";
import { AtualizarAgendamento, VerificarDuplicados } from '../../database/agendamentoRepository';

const Validation = Yup.object().shape({
  Nome: Yup.string()
    .min(3, 'Minimo de 3 caracteres!')
    .max(50, 'Máximo de 50 caracteres!')
    .required('Obrigatorio'),

  Telefone: Yup.string()
    .matches(/^\d{10,11}$/, 'O telefone deve ter 10 ou 11 dígitos e conter apenas números')
    .required('Obrigatório'),

  Prestador: Yup.string()
    .min(3, 'Minimo de 3 caracteres!')
    .max(50, 'Máximo de 50 caracteres!'),

  Servico: Yup.string()
    .min(3, 'Minimo de 3 caracteres!')
    .max(50, 'Máximo de 50 caracteres!')
    .required('Obrigatorio'),
});


async function editarAgendamento(fecharModal, id, nome, telefone, data, hora, prestador, servico) {
  try {
    const agendamento = {
      id,
      nome,
      telefone,
      data,
      hora,
      prestador,
      servico,
    };
    console.log("Agendamento:", agendamento);
    var res = await AtualizarAgendamentoAsync(agendamento);
    console.log("Resposta:", res);
    fecharModal();
  } catch (error) {
    console.error("Erro ao inserir o agendamento:", error);

  }
}

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
    console.log(hora);
    console.log("hora:", agendamento.hora);
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
  const [timeString, setTimeString] = useState(time);

  const [data, setData] = useState({
      prestadores: [],
      servicos: [],
      selectedPrestador: '',
      selectedServico: '',
      errors: {},
  });

  const fetchPrestadores = async () => {
    try {
        const response = await fetch('URL_DA_API_PARA_PRESTADORES'); //chama o metodo para buscar os dados no banco
        const prestadores = await response.json();
        setData(prevData => ({ ...prevData, prestadores }));
    } catch (error) {
        console.error(error);
    }
  };

  // Função para buscar serviços
  const fetchServicos = async () => {
    try {
        const response = await fetch('URL_DA_API_PARA_SERVIÇOS');
        const servicos = await response.json();
        setData(prevData => ({ ...prevData, servicos }));
    } catch (error) {
        console.error(error);
    }
  };

  useEffect(() => {
    fetchPrestadores();
    fetchServicos();
  }, []);

  const handlePrestadorChange = (itemValue) => {
    setData(prevData => ({ ...prevData, selectedPrestador: itemValue }));
  };

  const handleServicoChange = (itemValue) => {
      setData(prevData => ({ ...prevData, selectedServico: itemValue }));
  };


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
    setTimeString(`${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`);
  };


  const initialValues = {
    Nome: EditAgendamento?.Nome || '',
    Telefone: EditAgendamento?.Telefone || '',
    Data: EditAgendamento?.Data || date.toLocaleDateString('en-CA'),
    Hora: EditAgendamento?.Hora || time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    Prestador: EditAgendamento?.Prestador || '',
    Servico: EditAgendamento?.Servico || '',
  };

  
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Validation}
      onSubmit={async (values) => {
        var id = null;

        if(EditAgendamento != null)
          id = EditAgendamento.id;

        const duplicado = await VerificarDuplicados(DateString, timeString, id);
        if (duplicado) {
          // Exiba o alerta se for duplicado
          Alert.alert(
            "Agendamento Duplicado",
            "Já existe um agendamento para esta data e hora. Deseja continuar?",
            [
              {
                text: "Não",
                onPress: () => console.log("Usuário cancelou o agendamento."),
                style: "cancel",
              },
              {
                text: "Sim",
                onPress: async () => {
                  // Se o usuário optar por continuar, execute a lógica de criação ou edição do agendamento
                  if (EditAgendamento) {
                    await editarAgendamento(fecharModal, EditAgendamento.id, values.Nome, values.Telefone, DateString, timeString, values.Prestador, values.Servico);
                  } else {
                    await criarAgendamento(fecharModal, values.Nome, values.Telefone, DateString, timeString, values.Prestador, values.Servico);
                  }
                },
              },
            ],
            { cancelable: false } // impede que o usuário saia sem tomar uma decisão
          );
        } else {
          // Se não for duplicado, execute diretamente a lógica de criação ou edição do agendamento
          if (EditAgendamento) {
            await editarAgendamento(fecharModal, EditAgendamento.id, values.Nome, values.Telefone, DateString, timeString, values.Prestador, values.Servico);
          } else {
            await criarAgendamento(fecharModal, values.Nome, values.Telefone, DateString, timeString, values.Prestador, values.Servico);
          }
        }
      }}

    >
      {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => (
          <View style={styles.container}>
            <FloatingLabelInput
                labelStyles={styles.labelStyle}
                containerStyles={styles.input}
                onChangeText={handleChange('Nome')}
                value={values.Nome}
                label="Nome"
            />
            {errors.Nome && touched.Nome ? (
                <Text style={styles.error}>{errors.Nome}</Text>
            ) : null}

            <FloatingLabelInput
                labelStyles={styles.labelStyle}
                containerStyles={styles.input}
                onChangeText={handleChange('Telefone')}
                value={values.Telefone}
                label="Telefone"
                keyboardType="numeric"
            />
            {errors.Telefone && touched.Telefone ? (
                <Text style={styles.error}>{errors.Telefone}</Text>
            ) : null}

            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date" // Modo de data
                    is24Hour={true}
                    display="calendar"
                    onChange={onChange}
                    style={styles.input}
                />
            )}
            <TextInput
                style={styles.input}
                onChangeText={handleChange('date')}
                value={DateString}
                onPress={() => setShow(true)}
            />

            {showtime && (
                <DateTimePicker
                    value={time}
                    mode="time"
                    is24Hour={true}
                    display="clock"
                    onChange={onChangeTime}
                    style={styles.input}
                />
            )}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={handleChange('Hora')}
                    value={timeString}
                    onPress={() => setShowtime(true)}
                />
            </View>

            <Picker
              selectedValue={data.selectedPrestador}
              style={styles.picker}
              onValueChange={handlePrestadorChange}
            >
              <Picker.Item label="Selecione um prestador" value="" />
              {data.prestadores.map((prestador) => (
                  <Picker.Item key={prestador.id} label={prestador.nome} value={prestador.id} />
              ))}
            </Picker>
            {errors.Prestador && touched.Prestador ? (
                <Text style={styles.error}>{errors.Prestador}</Text>
            ) : null}

            <Picker
              selectedValue={data.selectedServico}
              style={styles.picker}
              onValueChange={handleServicoChange}
            >
              <Picker.Item label="Selecione um serviço" value="" />
              {data.servicos.map((servico) => (
                  <Picker.Item key={servico.id} label={servico.nome} value={servico.id} />
              ))}
            </Picker>
            {errors.Servico && touched.Servico ? (
                <Text style={styles.error}>{errors.Servico}</Text>
            ) : null}

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
    backgroundColor: "white", alignSelf: "center", width: "90%", padding: 30, borderRadius: 20,
    justifyContent: "space-between",
  },

  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#262626', // Cor de fundo do Picker
    color: 'white', // Cor do texto selecionado
    borderColor: '#007bff',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10
  },

  labelStyle: {
    backgroundColor: "white", paddingHorizontal: 10, 
  },

  input: {
    textAlign: 'center',
    height: 45,
    color: 'black',
    fontSize: 20,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
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
