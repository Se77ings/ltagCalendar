import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FloatingLabelInput } from "react-native-floating-label-input";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { AsyncStorage } from "react-native";

import { StyleSheet, Text, View, ScrollView, TextInput, Alert, TouchableOpacity, Pressable } from "react-native";
import * as Yup from "yup";
import { Formik } from "formik";
import adicionarAgendamento, { AtualizarAgendamentoAsync, obterServicosColaboradoresPorAgendamentoAsync, RealizarAtendimentoAsync } from "../../services/agendamentoService";
import { VerificarDuplicados } from "../../database/agendamentoRepository";
import { ObterColaboradores } from "../../database/colaboradorRepository";
import { ObterServicosPorFavorito } from "../../database/servicoRepository";
import DropdownSelector from "../../assets/components/DropdownSelector";

const Validation = Yup.object().shape({
  Nome: Yup.string().min(3, "Minimo de 3 caracteres!").max(50, "Máximo de 50 caracteres!").required("Obrigatorio"),

  Telefone: Yup.string()
    .matches(/^\d{10,11}$/, "O telefone deve ter 10 ou 11 dígitos e conter apenas números")
    .required("Obrigatório"),
});

async function editarCompletarAgendamento(fecharModal, id, nome, telefone, data, hora, Colaboradores, servico, AgendamentoSelecionado, option) {
  const agendamento = {
    id,
    nome,
    telefone,
    data,
    hora,
    Colaboradores,
    servico,
  };
  if (servico.length == 0) {
    Alert.alert("Atenção", "Selecione ao menos um serviço");
    return;
  }
  if (option == "Finalizar") {
    RealizarAtendimentoAsync(agendamento).then((result) => {
      if (result.error) {
        console.log("Erro ao finalizar o agendamento:", result.error);
        return;
      } else {
        console.log("Agendamento finalizado com sucesso!");
        fecharModal();
      }
    });
  }

  try {
    var res = await AtualizarAgendamentoAsync(agendamento);
    if (res.error) {
      console.log("Erro ao atualizar o agendamento:", res.error);
      return;
    } else {
      console.log("Agendamento atualizado com sucesso!");
      fecharModal();
    }
  } catch (error) {
    console.error("Erro ao Editar o agendamento:", error);
  }
}

async function criarAgendamento(navigation, nome, telefone, data, hora, Colaboradores, servico) {
  try {
    const agendamento = {
      nome,
      telefone,
      data,
      hora,
      servico,
      Colaboradores,
    };

    if (servico.length == 0) {
      Alert.alert("Atenção", "Selecione ao menos um serviço");
      return;
    }

    await adicionarAgendamento(agendamento);
    navigation.navigate("Home");
  } catch (error) {
    console.error("Erro ao inserir o agendamento:", error);
  }
}

export default function NovoAgendamento({ fecharModal, AgendamentoSelecionado, option }) {
  const navigation = useNavigation();
  const formatTime = (date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [DateString, setDateString] = useState(date.toISOString().split("T")[0]);
  const [time, setTime] = useState(new Date());
  const [showtime, setShowtime] = useState(false);
  const [timeString, setTimeString] = useState(formatTime(time));
  const [servicoLoading, setServicoLoading] = useState(false);
  const [colaboradorLoading, setColaboradorLoading] = useState(false);
  const [data, setData] = useState({
    prestadores: [],
    servicos: [],
    selectedPrestador: "",
    selectedServico: "",
  });

  useEffect(() => {}, [data.selectedServico]);

  useEffect(() => {
    setTimeString(formatTime(time));
  }, [time]);

  async function zeraPrestadorServico() {
    setData((prevData) => ({ ...prevData, selectedPrestador: [], selectedServico: [] }));
  }

  let removerDuplicados = (array) => {
    return array.filter((a, b) => array.indexOf(a) === b);
  };

  const populaDropdown = async (result) => {
    if (result === "update") {
      setTimeout(() => {
        setColaboradorLoading(false);
      }, 1000);
      return;
    }
    await zeraPrestadorServico();
    const novosServicos = result.data.servicos.map((servico) => ({
      id: servico.id,
      Nome: servico.Nome,
    }));

    await setData((prevData) => ({
      ...prevData,
      selectedServico: novosServicos,
    }));

    const novosColaboradores = result.data.colaboradores.reduce((acumulador, colaborador) => {
      if (!acumulador.some((prestador) => prestador.id === colaborador.ColaboradorId)) {
        acumulador.push({ id: colaborador.ColaboradorId, Nome: colaborador.Nome });
      } else {
        console.log("Esse colaborador está repetido:> ", colaborador.Nome);
      }
      return acumulador;
    }, []);

    await setData((prevData) => ({
      ...prevData,
      selectedPrestador: novosColaboradores,
    }));

    setServicoLoading(false);
    setColaboradorLoading(false);
  };

  useEffect(() => {
    if (AgendamentoSelecionado) {
      setServicoLoading(true);
      setColaboradorLoading(true);
      obterServicosColaboradoresPorAgendamentoAsync(AgendamentoSelecionado.id).then((result) => {
        if (result.error) {
          Alert.alert("Erro", "Erro ao obter os dados do agendamento " + result.error);
          return;
        }

        populaDropdown(result);
      });

      setDate(new Date(AgendamentoSelecionado.Data));
      setTime(new Date(`1970-01-01T${AgendamentoSelecionado.Hora}:00`));
      setDateString(AgendamentoSelecionado.Data);
      setTimeString(AgendamentoSelecionado.Hora);
    } else {
      setDate(new Date());
      setTime(new Date());
      setDateString(new Date().toISOString().split("T")[0]);
      setTimeString(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }
  }, [AgendamentoSelecionado]);

  const fetchColaboradores = async () => {
    ObterColaboradores().then((result) => {
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
    const selectedServico = data.servicos.filter((servico) => itemValue.includes(servico.id));

    setData((prevData) => ({
      ...prevData,
      selectedServico: selectedServico,
    }));
    setColaboradorLoading(true);
    populaDropdown("update");
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
    Nome: AgendamentoSelecionado?.Nome || "",
    Telefone: AgendamentoSelecionado?.Telefone || "",
    Data: AgendamentoSelecionado?.Data || date.toLocaleDateString("en-CA"),
    Hora: AgendamentoSelecionado?.Hora || time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  return (
    <>
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

          if (AgendamentoSelecionado != null) id = AgendamentoSelecionado.id;

          const duplicado = await VerificarDuplicados(DateString, timeString, id);
          if (duplicado) {
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
                    if (AgendamentoSelecionado) {
                      await editarCompletarAgendamento(fecharModal, AgendamentoSelecionado.id, values.Nome, values.Telefone, DateString, timeString, data.selectedPrestador, data.selectedServico, option);
                    } else {
                      await criarAgendamento(navigation, values.Nome, values.Telefone, DateString, timeString, data.selectedPrestador, data.selectedServico, AgendamentoSelecionado);
                    }
                  },
                },
              ],
              { cancelable: false }
            );
          } else {
            if (AgendamentoSelecionado) {
              await editarCompletarAgendamento(fecharModal, AgendamentoSelecionado.id, values.Nome, values.Telefone, DateString, timeString, data.selectedPrestador, data.selectedServico, AgendamentoSelecionado, option);
            } else {
              await criarAgendamento(navigation, values.Nome, values.Telefone, DateString, timeString, data.selectedPrestador, data.selectedServico);
            }
          }
        }}>
        {({ handleChange, handleSubmit, errors, touched, values }) => (
          <ScrollView contentContainerStyle={[!AgendamentoSelecionado ? styles.main : { backgroundColor: "rgba(0,0,0,0.5)", height: "100%", justifyContent: "center", padding: 20, elevation: 5 }]}>
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>{option ? option + " Agendamento" : "Novo Agendamento"}</Text>
              {AgendamentoSelecionado && (
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
              {show && <DateTimePicker testID="dateTimePicker" value={date} mode="date" is24Hour={true} display="calendar" onChange={onChange} style={styles.input} />}
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
              {!servicoLoading && <DropdownSelector lista={data.servicos} label={"Serviço(s)"} icone={"briefcase-outline"} callbackSelecionados={handleServicoChange} selectedItems={data.selectedServico} opt={"servico"} />}
              {errors.Servico && touched.Servico ? <Text style={styles.error}>{errors.Servico}</Text> : null}
              {!colaboradorLoading && <DropdownSelector lista={data.prestadores} label={"Colaborador(es)"} icone={"people-outline"} callbackSelecionados={handlePrestadorChange} selectedItems={data.selectedPrestador} opt={"colaborador"} servicoSelecionado={data.selectedServico} />}
              {errors.Prestador && touched.Prestador ? <Text style={styles.error}>{errors.Prestador}</Text> : null}
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>{option ? option : "Cadastrar"}</Text>
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
