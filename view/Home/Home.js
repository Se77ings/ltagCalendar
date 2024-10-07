import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, Modal, Pressable, Button, InteractionManager } from "react-native";
import moment from "moment";
import "moment/locale/pt-br"; // Importa o locale em português
import NovoAgendamento from "./NovoAgendamento";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import initializaDatabase from "../../database/initializeDatabase";
import adicionarAgendamento, { obterAgendamentos, RemoverAgendamentoAsync } from "../../services/agendamentoService";
import styles from "../../assets/styles/styles";
import Header from "../../assets/components/Header";
// parei na parte onde tento fazer o scrollTo para o dia atual

const SliderData = ({ flatListRef, selectedDate, setSelectedDate, scrollToDay }) => {
  const [days, setDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(moment()); // Mês atual

  useEffect(() => {
    let hoje = moment();
    hojeOBJ = {
      day: hoje.format("DD"),
      dayName: hoje.format("ddd"),
      fullDate: hoje.format("YYYY-MM-DD"),
    };

    const timeoutId = setTimeout(() => {
      if (flatListRef.current && days.length > 0) {
        // Verifica se o array days está preenchido
        const index = days.findIndex((day) => day.fullDate === hojeOBJ.fullDate);
        if (index !== -1) {
          flatListRef.current.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
          setSelectedDate(hojeOBJ);
        } else {
          flatListRef.current.scrollToIndex({ index: 0, animated: true, viewPosition: 0.5 });
          setSelectedDate(days[0]); // Verifica se days[0] existe antes de acessá-lo
        }
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [days]);

  useEffect(() => {
    generateDays();
  }, [currentMonth]); // Atualiza quando o mês atual muda

  const goToPreviousMonth = () => {
    setCurrentMonth(currentMonth.clone().subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentMonth(currentMonth.clone().add(1, "month"));
  };

  const generateDays = () => {
    let daysArray = [];
    const totalDays = currentMonth.daysInMonth(); // Total de dias no mês atual

    for (let i = 1; i <= totalDays; i++) {
      const date = currentMonth.date(i);
      daysArray.push({
        day: date.format("DD"),
        dayName: date.format("ddd"), // Nome do dia da semana (em português)
        fullDate: date.format("YYYY-MM-DD"),
      });
    }
    setDays(daysArray);
  };

  const onDayPress = (day) => {
    scrollToDay(day);
  };

  const renderDay = ({ item }) => (
    <TouchableOpacity
      style={styles.dayContainer}
      onPress={() => {
        scrollToDay(item);
        onDayPress(item);
      }}>
      <Text style={[styles.dayName, item.fullDate === selectedDate.fullDate && styles.selectedDay]}>{item.dayName}</Text>
      <Text style={[styles.dayNumber, item.fullDate === selectedDate.fullDate && styles.selectedDay]}>{item.day}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth}>
          <Text style={styles.arrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>{currentMonth.format("MMMM YYYY")}</Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>

      <View>
        <View style={{ borderTopWidth: 0.5, marginHorizontal: 20, borderColor: "grey" }} />

        <FlatList ref={flatListRef} data={days} horizontal showsHorizontalScrollIndicator={false} keyExtractor={(item) => item.fullDate} renderItem={renderDay} contentContainerStyle={styles.listContainer} />
        <View style={{ borderTopWidth: 0.5, marginHorizontal: 20, borderColor: "grey" }} />
      </View>
    </>
  );
};

const Cards = ({ data, setAgendamentoSelecionado, setModalVisible }) => {
  const excluirAgendamento = (id) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza que deseja excluir este agendamento?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            const result = await RemoverAgendamentoAsync(id);
            if (result.success) {
              obter();
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const editarAgendamento = (item) => {
    setAgendamentoSelecionado(item);
    setModalVisible(true);
  };

  const isPast = (date, time) => {
    const now = moment();
    const appointmentDateTime = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm");
    return appointmentDateTime.isBefore(now);
  };

  const formatarData = (data) => {
    const partes = data.split("-"); // Divide a string em partes
    return `${partes[2]}/${partes[1]}/${partes[0]}`; // Retorna no formato DD-MM-YYYY
  };

  const renderAgendamento = ({ item }) => (
    <View
      style={[
        styles.agendamento,
        isPast(formatarData(item.Data), item.Hora) ? styles.agendamentoAtrasado : null, // Aplica o estilo vermelho se o horário for anterior à data atual
      ]}>
      <Image source={{ uri: "https://encurtador.com.br/3Bh7L" }} style={styles.imagemServico} />
      <View style={styles.info}>
        <Text style={styles.nome}>{item.Nome}</Text>
        <Text style={styles.servico}>{item.Servico}</Text>
        <Text style={styles.horario}>Horário:{item.Hora}</Text>
        <Text style={styles.data}>{formatarData(item.Data)}</Text>
      </View>
      <View style={styles.botoes}>
        <TouchableOpacity style={styles.botaoEditar} onPress={() => editarAgendamento(item)}>
          <Text style={styles.textoBotao}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoExcluir} onPress={() => excluirAgendamento(item.id)}>
          <Text style={styles.textoBotao}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <FlatList
      data={data} // Exibe todos os agendamentos
      renderItem={renderAgendamento}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.lista}
    />
  );
};

const Home = () => {
  moment.locale("pt-br");
  const [selectedDate, setSelectedDate] = useState("");
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const flatListRef = useRef(null);
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    initialize();
    obter();
  }, []);

  const scrollToDay = (item) => {
    setSelectedDate(item);

    flatListRef.current.scrollToItem({
      item: item,
      animated: true,
      viewPosition: 0.5, // Centraliza o item na tela
    });
  };

  async function obter() {
    var result = await obterAgendamentos();
    setAgendamentos(result.data);
  }

  const initialize = async () => {
    try {
      await initializaDatabase();
      console.log("Banco de dados inicializado com sucesso.");
    } catch (error) {
      console.error("Erro ao inicializar o banco de dados:", error);
    }
  };

  const fecharModal = () => {
    setModalVisible(false);
    obter();
  };

  const abrirModal = () => {
    setAgendamentoSelecionado(null);
    setModalVisible(true);
  };

  const agendamentosFiltrados = agendamentos.filter((agendamento) => agendamento.Data === selectedDate);
  return (
    <>
      <View style={[styles.container]}>
        <TouchableOpacity
          style={{ position: "absolute", bottom: 10, right: 10, zIndex: 50 }}
          onPress={() => abrirModal()} // NovoAgendamento
        >
          <Text style={styles.newAppointmentText}>+</Text>
        </TouchableOpacity>
        <Header title={"Menu Inicial"} />
        <View style={{ paddingTop: 20 }}>
          <SliderData flatListRef={flatListRef} selectedDate={selectedDate} setSelectedDate={setSelectedDate} scrollToDay={scrollToDay} />
          <Text style={styles.titulo}>MEUS AGENDAMENTOS</Text>
        </View>
        {selectedDate === "" ? (
          <Cards data={agendamentos} setAgendamentoSelecionado={setAgendamentoSelecionado} setModalVisible={setModalVisible} />
        ) : agendamentosFiltrados.length > 0 ? (
          // <FlatList data={agendamentosFiltrados.length > 0 ? agendamentosFiltrados : agendamentos} renderItem={renderAgendamento} keyExtractor={(item) => item.id} contentContainerStyle={styles.lista} />
          <Cards data={agendamentosFiltrados} setAgendamentoSelecionado={setAgendamentoSelecionado} setModalVisible={setModalVisible} />
        ) : (
          <Text style={styles.semAgendamentos}>Nenhum agendamento para esta data</Text> // Mensagem para datas sem agendamentos
        )}
      </View>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <Pressable
          onPress={() => {
            setModalVisible(false);
          }}
          style={{ height: "100%", backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center" }}>
          <Pressable>
            <NovoAgendamento fecharModal={() => fecharModal()} EditAgendamento={agendamentoSelecionado} />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default Home;
