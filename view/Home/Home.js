import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView, Alert, Image, Modal, Pressable, Button, InteractionManager } from "react-native";
import moment from "moment";
import "moment/locale/pt-br"; // Importa o locale em português
import NovoAgendamento from "./NovoAgendamento";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import initializaDatabase from "../../database/initializeDatabase";
import adicionarAgendamento, { obterAgendamentos, RemoverAgendamentoAsync } from "../../services/agendamentoService";
import { ObterServicosPorColaboradorAsync, ObterTodosServicosAsync } from "../../services/servicoService";
import styles from "../../assets/styles/styles";
import Header from "../../assets/components/Header";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import Atendimento from "./Atendimento";

// parei na parte onde tento fazer o scrollTo para o dia atual
const formatarData = (data) => {
  const partes = data.split("-"); // Divide a string em partes
  return `${partes[2]}/${partes[1]}/${partes[0]}`; // Retorna no formato DD-MM-YYYY
};

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

  const ITEM_HEIGHT = 70; // Altura de cada item
  const getItemLayout = (data, index) => ({
    length: ITEM_HEIGHT, // altura de cada item
    offset: ITEM_HEIGHT * index, // deslocamento com base no índice
    index,
  });

  const handleScrollToIndexFailed = (info) => {
    const wait = new Promise((resolve) => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({
        index: info.index,
        animated: true,
      });
    });
  };
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

        <FlatList ref={flatListRef} getItemLayout={getItemLayout} onScrollToIndexFailed={handleScrollToIndexFailed} data={days} horizontal showsHorizontalScrollIndicator={false} keyExtractor={(item) => item.fullDate} renderItem={renderDay} contentContainerStyle={styles.listContainer} />
        <View style={{ borderTopWidth: 0.5, marginHorizontal: 20, borderColor: "grey" }} />
      </View>
    </>
  );
};

const Cards = ({ data, setAgendamentoSelecionado, setmodalCreate, setmodalCompleteAgendamento }) => {
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
    setmodalCreate(true);
  };

  const finalizarAgendamento = (item) => {
    setAgendamentoSelecionado(item);
    setmodalCompleteAgendamento(true);
  };

  const getLocalTime = () => {
    const now = new Date();
    const localTime = new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Sao_Paulo", // Ajuste para o fuso horário desejado
    }).format(now);
    return localTime;
  };

  const getLocalDate = () => {
    const now = new Date();
    const localDate = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "America/Sao_Paulo", // Ajuste para o fuso horário desejado
    }).format(now);
    return localDate;
  };

  const isPast = (date, time) => {
    const agora = getLocalTime();
    const hoje = getLocalDate();
    const [day, month, year] = date.split("/").map(Number);
    const [currentDay, currentMonth, currentYear] = hoje.split("/").map(Number);
    const [currentHour, currentMinute] = agora.split(":").map(Number);
    const [timeHour, timeMinute] = time.split(":").map(Number);
    const receivedDate = new Date(year, month - 1, day);
    const currentDate = new Date(currentYear, currentMonth - 1, currentDay);

    if (receivedDate < currentDate) {
      return true;
    }

    if (receivedDate.getTime() === currentDate.getTime()) {
      if (timeHour < currentHour || (timeHour === currentHour && timeMinute < currentMinute)) {
        return true;
      }
    }
    return false;
  };

  const renderAgendamento = ({ item }) => (
    <View style={[styles.agendamento, isPast(formatarData(item.Data), item.Hora) ? styles.agendamentoAtrasado : null]}>
      <Image source={{ uri: "https://encurtador.com.br/3Bh7L" }} style={styles.imagemServico} />
      <View style={styles.info}>
        <Text style={styles.nome}>{item.Nome}</Text>
        <Text style={styles.servico}>{item.Servico}</Text>
        <Text style={[styles.horario, isPast(formatarData(item.Data), item.Hora) && { color: "red", fontWeight: "bold" }]}>Horário:{item.Hora}</Text>
      </View>
      <View style={styles.botoes}>
        <TouchableOpacity style={[styles.botao, {}]} onPress={() => editarAgendamento(item)}>
          <Ionicons name="create-outline" color={"#0045a0"} size={22} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.botao, {}]} onPress={() => excluirAgendamento(item.id)}>
          <Ionicons name="trash" color={"#f44336"} size={22} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.botao, {}]} onPress={() => finalizarAgendamento(item)}>
          <Ionicons name="checkmark" color={"#008000"} size={22} />
        </TouchableOpacity>
      </View>
    </View>
  );
  return <FlatList data={data} renderItem={renderAgendamento} keyExtractor={(item) => item.id} contentContainerStyle={styles.lista} scrollEnabled={false} />;
};

const Home = () => {
  /*Mudar para um componente*/
  const [selectedItems, setSelectedItems] = useState([]);
  const navigation = useNavigation();

  const onSelectedItemsChange = useCallback((items) => {
    setSelectedItems(items);
  }, []);

  moment.locale("pt-br");
  const [selectedDate, setSelectedDate] = useState("");
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState();
  const [modalCompleteAgendamento, setmodalCompleteAgendamento] = useState(false);
  const [modalCreate, setmodalCreate] = useState(false);
  const flatListRef = useRef(null);
  const [agendamentos, setAgendamentos] = useState([]);

  async function obter() {
    var result = await obterAgendamentos();
    setAgendamentos(result.data);
  }


  useEffect(() => {
    initialize();
    obter();
  }, []);

  const filterAgendamentos = (agendamento) => {
    return agendamento.filter((agendamento) => agendamento.Data === selectedDate.fullDate);
  };

  const scrollToDay = (item) => {
    setSelectedDate(item);

    flatListRef.current.scrollToItem({
      item: item,
      animated: true,
      viewPosition: 0.5, // Centraliza o item na tela
    });
  };

  const initialize = async () => {
    try {
      await initializaDatabase();
      console.log("Banco de dados inicializado com sucesso.");
    } catch (error) {
      console.error("Erro ao inicializar o banco de dados:", error);
    }
  };

  const fecharModal = () => {
    setmodalCreate(false);
    obter();
  };

  const abrirModal = () => {
    setAgendamentoSelecionado(null);
    setmodalCreate(true);
  };

  // const agendamentosFiltrados = agendamentos.filter((agendamento) => agendamento.Data === selectedDate);


  return (
    <>
      <View style={[styles.container]}>
        <TouchableOpacity
          style={{ position: "absolute", bottom: 10, right: 10, zIndex: 50 }}
          onPress={() => navigation.navigate("NovoAgendamento")} // NovoAgendamento
        >
          <Text style={styles.newAppointmentText}>+</Text>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={{}}>
          <Header title={"Menu Inicial"} />
          <View style={{ paddingTop: 20 }}>
            <SliderData flatListRef={flatListRef} selectedDate={selectedDate} setSelectedDate={setSelectedDate} scrollToDay={scrollToDay} />
            <Text style={styles.titulo}>MEUS AGENDAMENTOS</Text>
          </View>
          {filterAgendamentos(agendamentos).length != 0 ? (
            <>
              <Cards data={filterAgendamentos(agendamentos)} setAgendamentoSelecionado={setAgendamentoSelecionado} setmodalCreate={setmodalCreate} setmodalCompleteAgendamento={setmodalCompleteAgendamento} />
            </>
          ) : (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={{ textAlign: "center", marginTop: 20 }}>Ainda não há nenhum agendamento para este dia</Text>
              <Text style={{ textAlign: "center", marginTop: 0 }}>Utilize o item abaixo para adicionar um agendamento</Text>
            </View>
          )}
        </ScrollView>
      </View>
      {/* <Modal visible={modalCreate} transparent={true} animationType="slide">
        <Pressable
          onPress={() => {
            setmodalCreate(false);
          }}
          style={{ height: "100%", backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center" }}>
          <Pressable>
            <NovoAgendamento fecharModal={() => fecharModal()} EditAgendamento={agendamentoSelecionado} />
          </Pressable>
        </Pressable>
      </Modal> */}
      <Modal visible={modalCompleteAgendamento} transparent={true} animationType="slide">
        <Pressable
          onPress={() => setmodalCompleteAgendamento(false)}
          style={{
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Pressable style={{ width: "90%" }}>
            {agendamentoSelecionado && (
             <Atendimento agendamentoSelecionado={agendamentoSelecionado} formatarData={formatarData} setmodalCompleteAgendamento={setmodalCompleteAgendamento}/>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const Main = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="NovoAgendamento" component={NovoAgendamento} options={{ headerTitle: "Novo Agendamento", headerTitleAlign: "center" }} />
    </Stack.Navigator>
  );

  /*  <View style={{height:"100%", justifyContent:"center"}}>
      <Formik>>
        .....
      </Formik>
    </View>*/
};

export default Main;
