import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FloatingLabelInput } from "react-native-floating-label-input";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import { StyleSheet, Text, View, ScrollView, TextInput, Alert, TouchableOpacity, Pressable } from "react-native";
import * as Yup from "yup";
import { Formik } from "formik";
import adicionarAgendamento, { AtualizarAgendamentoAsync } from "../../services/agendamentoService";
import { AtualizarAgendamento, VerificarDuplicados } from "../../database/agendamentoRepository";
import { ObterColaboradores } from "../../database/colaboradorRepository";
import { ObterServicosPorFavorito } from "../../database/servicoRepository";
import DropdownSelector from "../../assets/components/DropdownSelector";

const Validation = Yup.object().shape({
  Nome: Yup.string().min(3, "Minimo de 3 caracteres!").max(50, "Máximo de 50 caracteres!").required("Obrigatorio"),

  Telefone: Yup.string()
    .matches(/^\d{10,11}$/, "O telefone deve ter 10 ou 11 dígitos e conter apenas números")
    .required("Obrigatório"),

  // Prestador: Yup.string().min(3, "Minimo de 3 caracteres!").max(50, "Máximo de 50 caracteres!"),

  // Servico: Yup.string().min(3, "Minimo de 3 caracteres!").max(50, "Máximo de 50 caracteres!").required("Obrigatorio"),
});

async function editarAgendamento(fecharModal, id, nome, telefone, data, hora, Colaboradores, servico) {
  try {
    const agendamento = {
      id,
      nome,
      telefone,
      data,
      hora,
      Colaboradores,
      servico,
    };
    var res = await AtualizarAgendamentoAsync(agendamento);
    EditAgendamento && fecharModal();
  } catch (error) {
    console.error("Erro ao inserir o agendamento:", error);
  }
}


export default function NovoAgendamento({ fecharModal, EditAgendamento, handleUpdate }) {
  const navigation = useNavigation();
  const formatTime = (date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Desativa o formato de 12 horas
    });
  };
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [DateString, setDateString] = useState(date.toISOString().split("T")[0]);
  const [time, setTime] = useState(new Date());
  const [showtime, setShowtime] = useState(false);
  const [timeString, setTimeString] = useState(formatTime(time));
  const [data, setData] = useState({
    prestadores: [],
    servicos: [],
    selectedPrestador: "",
    selectedServico: "",
    errors: {},
  });
  useEffect(()=>{
    // handleUpdate(); 
  },[])
  
  useEffect(() => {
    setTimeString(formatTime(time));
  }, [time]);
  
  useEffect(() => {
    // Verifica se EditAgendamento não está vazio
    if (EditAgendamento) {
      setDate(new Date(EditAgendamento.Data)); // Definindo o estado da data
      setTime(new Date(`1970-01-01T${EditAgendamento.Hora}:00`)); // Definindo o estado da hora
      setDateString(EditAgendamento.Data); // Atualiza a string da data
      setTimeString(EditAgendamento.Hora); // Atualiza a string da hora
    } else {
      // Lógica a ser executada quando EditAgendamento está vazio
      setDate(new Date()); // Reseta para a data atual
      setTime(new Date()); // Reseta para a hora atual
      setDateString(new Date().toISOString().split("T")[0]); // Define a string da data atual
      console.log("eh pra setar ioss:", new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setTimeString(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })); // Define a string da hora atual
    }
  }, [EditAgendamento]);
  
  //acho que o problema vai ser em alguma letra maiuscula o minuscula, pq aparentemente, o back recebe os dados daqui
  async function criarAgendamento(navigation, nome, telefone, data, hora, Colaboradores, servico, setUpdate) {
    console.log("Dados que vou enviar ");
    try {
      const agendamento = {
        nome,
        telefone,
        data,
        hora,
        servico,
        Colaboradores,
      };
      console.log(agendamento);
  
      var res = await adicionarAgendamento(agendamento);
      console.log("retorno do adicionar agendamento");
      console.log(res);
  
      navigation.navigate("Home");
      console.log("Cheguei aqui")
      
    } catch (error) {
      console.error("Erro ao inserir o agendamento:", error);
    }
  }
  const fetchColaboradores = async () => {
    ObterColaboradores().then((result) => {
      console.log("Certeza!!!")
      console.log(result)
      setData((prevData) => ({ ...prevData, prestadores: result }));
    });
  };

  const fetchServicos = async () => {
    ObterServicosPorFavorito().then((result) => {
      setData((prevData) => ({ ...prevData, servicos: result }));
    });
  };

  useEffect(() => {
    fetchColaboradores();
    fetchServicos();
  }, []);

  const handlePrestadorChange = (itemValue) => {
    const selectedPrestador = data.prestadores.filter((prestador) => itemValue.includes(prestador.id));

    setData((prevData) => ({
      ...prevData,
      selectedPrestador: selectedPrestador,
    }));
  };

  const handleServicoChange = (itemValue) => {
    // Filtro que retorna os serviços correspondentes aos IDs selecionados
    const selectedServicos = data.servicos.filter((servico) => itemValue.includes(servico.id));

    // Atualizar o estado com os serviços selecionados
    setData((prevData) => ({
      ...prevData,
      selectedServico: selectedServicos,
    }));
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setDateString(currentDate.toISOString().split("T")[0]);
  };
  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowtime(false);
    setTime(currentTime);
    setTimeString(`${currentTime.getHours().toString().padStart(2, "0")}:${currentTime.getMinutes().toString().padStart(2, "0")}`);
  };

  const initialValues = {
    Nome: EditAgendamento?.Nome || "",
    Telefone: EditAgendamento?.Telefone || "",
    Data: EditAgendamento?.Data || date.toLocaleDateString("en-CA"),
    Hora: EditAgendamento?.Hora || time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  return (
    <>
      <StatusBar style="dark" />
      <Formik
        initialValues={initialValues}
        validationSchema={Validation}
        onSubmit={async (values) => {
          if (data.selectedPrestador === "") {
            Alert.alert("Atenção", "Selecione um prestador ");
            return;
          }
          if (data.selectedServico === "") {
            Alert.alert("Atenção", "Selecione um serviço ");
            return;
          }

          var id = null;

          if (EditAgendamento != null) id = EditAgendamento.id;

          const duplicado = await VerificarDuplicados(DateString, timeString, id);
          if (duplicado) {
            // Exiba o alerta se for duplicado
            Alert.alert(
              "Agendamento Duplicado",
              "Já existe um agendamento para esta data e hora. Deseja continuar?",
              [
                {
                  text: "Não",
                  style: "cancel",
                },
                {
                  text: "Sim",
                  onPress: async () => {
                    // Se o usuário optar por continuar, execute a lógica de criação ou edição do agendamento
                    if (EditAgendamento) {
                      await editarAgendamento(fecharModal, EditAgendamento.id, values.Nome, values.Telefone, DateString, timeString, data.selectedPrestador, data.selectedServico);
                    } else {
                      await criarAgendamento(navigation, values.Nome, values.Telefone, DateString, timeString, data.selectedPrestador, data.selectedServico);
                    }
                  },
                },
              ],
              { cancelable: false } // impede que o usuário saia sem tomar uma decisão
            );
          } else {
            // Se não for duplicado, execute diretamente a lógica de criação ou edição do agendamento
            if (EditAgendamento) {
              await editarAgendamento(fecharModal, EditAgendamento.id, values.Nome, values.Telefone, DateString, timeString, data.selectedPrestador, data.selectedServico);
            } else {
              await criarAgendamento(navigation, values.Nome, values.Telefone, DateString, timeString, data.selectedPrestador, data.selectedServico);
            }
          }
        }}>
        {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => (
          <ScrollView contentContainerStyle={[!EditAgendamento ? styles.main : { backgroundColor: "rgba(0,0,0,0.5)", height: "100%", justifyContent: "center", padding: 20, elevation: 5 }]}>
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>{EditAgendamento ? "Editar Agendamento" : "Novo Agendamento"}</Text>
              {EditAgendamento && (
                <TouchableOpacity
                  style={{ position: "absolute", top: 10, right: 10, zIndex: 1, backgroundColor: "#312fbf", borderRadius: 15, padding: 0 }}
                  onPress={() => {
                    fecharModal();
                  }}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              )}
              <FloatingLabelInput labelStyles={styles.labelStyle} containerStyles={styles.input} onChangeText={handleChange("Nome")} value={values.Nome} label="Nome" />
              {errors.Nome && touched.Nome ? <Text style={styles.error}>{errors.Nome}</Text> : null}
              <FloatingLabelInput labelStyles={styles.labelStyle} containerStyles={styles.input} onChangeText={handleChange("Telefone")} value={values.Telefone} label="Telefone" keyboardType="numeric" />
              {errors.Telefone && touched.Telefone ? <Text style={styles.error}>{errors.Telefone}</Text> : null}
              {show && <DateTimePicker testID="dateTimePicker" value={date} mode="date" is24Hour={true} display="calendar" onChange={onChange} style={styles.datePicker} />}
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
              <Pressable
                onPress={() => {
                  setShow(true);
                }}>
                <TextInput editable={false} style={[styles.input, { color: "black" }]} value={DateString} />
                <Ionicons style={{ position: "absolute", right: 10, top: 20 }} name="calendar" size={24} color="#312fbf" onPress={() => setShow(true)} />
              </Pressable>

              {showtime && <DateTimePicker value={time} mode="time" is24Hour={true} display="clock" onChange={onChangeTime} style={styles.input} />}
              <Pressable
                style={styles.inputContainer}
                onPress={() => {
                  setShowtime(true);
                }}>
                <TextInput style={[styles.input, { color: "black" }]} editable={false} value={formatTime(time)} />
                <Ionicons style={{ position: "absolute", right: 10, top: 20 }} name="time" size={24} color="#312fbf" onPress={() => setShowtime(true)} />
              </Pressable>
              {/* 
              <Picker selectedValue={data.selectedPrestador} style={styles.picker} onValueChange={handlePrestadorChange}>
                <Picker.Item label="Selecione um prestador" />
                {data.prestadores.map((prestador) => (
                  <Picker.Item key={prestador.id} label={prestador.Nome} value={prestador.id} />
                ))}
              </Picker> */}
              {/* <DropdownSelector lista={todosServicos} label={"Serviço(s)"} icone={"briefcase-outline"} callbackSelecionados={setServicosSelecionados} selectedItems={servicosSelecionados} /> */}

              <DropdownSelector lista={data.servicos} label={"Serviço(s)"} icone={"briefcase-outline"} callbackSelecionados={handleServicoChange} selectedItems={data.selectedServico} opt={"servico"} />
              {errors.Servico && touched.Servico ? <Text style={styles.error}>{errors.Servico}</Text> : null}

              <DropdownSelector lista={data.prestadores} label={"Colaborador(es)"} icone={"person-outline"} callbackSelecionados={handlePrestadorChange} selectedItems={data.selectedPrestador} opt={"colaborador"} />
              {errors.Prestador && touched.Prestador ? <Text style={styles.error}>{errors.Prestador}</Text> : null}
              {/* <Picker selectedValue={data.selectedServico} style={styles.picker} onValueChange={handleServicoChange}>
                <Picker.Item label="Selecione um serviço" />
                {data.servicos.map((servico) => (
                  <Picker.Item key={servico.id} label={servico.Nome} value={servico.id} />
                ))}
              </Picker> */}
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>{EditAgendamento ? "Editar" : "Cadastrar"}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </Formik>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    flexGrow: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
    justifyContent: "center",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#312fbf",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    height: 50,
    justifyContent: "center",
  },
  inputText: {
    color: "#333",
    fontSize: 16,
  },
  labelStyle: {
    color: "#312fbf",
  },
  picker: {
    backgroundColor: "#F3F4F6",
    borderRadius: 5,
    marginVertical: 10,
    height: 50,
  },
  submitButton: {
    backgroundColor: "#312fbf",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    marginTop: -8,
    paddingLeft: 10,
  },
  datePicker: {
    backgroundColor: "#F3F4F6",
    borderRadius: 5,
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
