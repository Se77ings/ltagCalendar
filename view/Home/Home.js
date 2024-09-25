import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, Modal, Pressable, Button } from "react-native";
import moment from "moment";
import "moment/locale/pt-br"; // Importa o locale em português
import NovoAgendamento from "./NovoAgendamento";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import initializaDatabase from "../../database/initializeDatabase";
import adicionarAgendamento, { obterAgendamentos, RemoverAgendamentoAsync } from "../../services/agendamentoService";

const AppointmentSlider = () => {
  const Stack = createStackNavigator();
  const navigation = useNavigation();
  // Define moment para português
  moment.locale("pt-br");

  const [currentMonth, setCurrentMonth] = useState(moment()); // Mês atual
  const [days, setDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState();

  //VARIAVEIS DOS MEUS AGENDAMENTOS
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    generateDays();
  }, [currentMonth]); // Atualiza quando o mês atual muda

    async function obter() {
      var result = await obterAgendamentos();

      setAgendamentos(result.data);
    }

  const [agendamentos, setAgendamentos] = useState([]);


  const initialize = async () => {
    try {
      await initializaDatabase();
      console.log('Banco de dados inicializado com sucesso.');
    } catch (error) {
      console.error('Erro ao inicializar o banco de dados:', error);
    }
  };
  
  useEffect(() => {  
    initialize();
    obter(); 
  }, []); 

  // Função para gerar os dias do mês atual
  const generateDays = () => {
    const totalDays = currentMonth.daysInMonth(); // Total de dias no mês atual
    let daysArray = [];

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

  // Função para quando um dia for pressionado
  const onDayPress = (day) => {
    setSelectedDate(day.fullDate);
  };

  // Função para ir para o mês anterior
  const goToPreviousMonth = () => {
    setCurrentMonth(currentMonth.clone().subtract(1, "month"));
  };

  // Função para ir para o mês seguinte
  const goToNextMonth = () => {
    setCurrentMonth(currentMonth.clone().add(1, "month"));
  };

  // Renderiza cada dia no slider
  const renderDay = ({ item }) => (
    <TouchableOpacity style={[styles.dayContainer, item.fullDate === selectedDate && styles.selectedDayContainer]} onPress={() => onDayPress(item)}>
      <Text style={styles.dayName}>{item.dayName}</Text>
      <Text style={styles.dayNumber}>{item.day}</Text>
    </TouchableOpacity>
  );

const fecharModal = () => {
  setModalVisible(false);
  obter();
}

const abrirModal = () => {
  setAgendamentoSelecionado(null);
  setModalVisible(true);
};


  const excluirAgendamento = (id) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza que deseja excluir este agendamento?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          onPress: async () => {
            const result = await RemoverAgendamentoAsync(id);
            if (result.success) {
              obter(); 
            }
          },
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  const editarAgendamento = (item) => 
    {
      console.log(item)
        setAgendamentoSelecionado(item);
        setModalVisible(true)
  };

  const isPast = (date, time) => {
    const now = moment();
    const appointmentDateTime = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm");
    return appointmentDateTime.isBefore(now);
  };

  const formatarData = (data) => {
    const partes = data.split('-'); // Divide a string em partes
    return `${partes[2]}/${partes[1]}/${partes[0]}`; // Retorna no formato DD-MM-YYYY
  };
  const renderAgendamento = ({ item }) => (
    <View
      style={[
        styles.agendamento,
        isPast(formatarData(item.Data), item.Hora) ? styles.agendamentoAtrasado : null, // Aplica o estilo vermelho se o horário for anterior à data atual
      ]}>
      <Image source={{ uri: 'https://encurtador.com.br/3Bh7L' }} style={styles.imagemServico} />
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

   const agendamentosFiltrados = agendamentos.filter((agendamento) => agendamento.Data === selectedDate);

  function Main() {
    return (
      <>
        
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: "https://img.freepik.com/psd-gratuitas/logotipo-abstrato-gradiente_23-2150689648.jpg" }} 
                style={styles.logo}
              />
              <View style={styles.texts}>
                <Text style={styles.shopName_}>SEJA BEM-VINDO!!</Text>
                <Text style={styles.shopName}>LTAG CALENDAR</Text>
              </View> 
            </View>
            {/* <Button title="ssadasda" onPress={()=>{criarAgendamento()}}></Button > */}
            <TouchableOpacity
              style={styles.newAppointmentButton}
              onPress={() => abrirModal()} // Navega para a página NovoAgendamento
            >
              <Text style={styles.newAppointmentText}>NOVO AGENDAMENTO</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
            <TouchableOpacity onPress={goToPreviousMonth}>
              <Text style={styles.arrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.monthText}>
              {currentMonth.format("MMMM YYYY")} 
            </Text>
            <TouchableOpacity onPress={goToNextMonth}>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          </View>

          <View>
            <FlatList data={days} horizontal showsHorizontalScrollIndicator={false} keyExtractor={(item) => item.fullDate} renderItem={renderDay} contentContainerStyle={styles.listContainer} />
          </View>

          <Text style={styles.titulo}>MEUS AGENDAMENTOS</Text>

          {selectedDate === "" ? (
            // Se não houver data selecionada, exibe todos os agendamentos
            <FlatList
              data={agendamentos} // Exibe todos os agendamentos
              renderItem={renderAgendamento}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.lista}
            />
          ) : // Se houver uma data selecionada, filtra os agendamentos
          agendamentosFiltrados.length > 0 ? (
            <FlatList data={agendamentosFiltrados.length > 0 ? agendamentosFiltrados : agendamentos} renderItem={renderAgendamento} keyExtractor={(item) => item.id} contentContainerStyle={styles.lista} />
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

            <NovoAgendamento fecharModal={() => fecharModal()}  EditAgendamento={agendamentoSelecionado} />
              </Pressable>
          </Pressable>
        </Modal>
      </>
    );
  }

  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
      <Stack.Screen name="NovoAgendamento" component={NovoAgendamento} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  agendamentoAtrasado: {
    // backgroundColor: 'red',
    borderColor: "red",
    borderWidth: 3,
    borderStyle: "solid",
  },

  containerFlatList: {
    flex: 1, // O contêiner ocupará o espaço disponível na tela
    justifyContent: "center", // Centraliza o conteúdo verticalmente quando não há itens
  },
  emptyContainer: {
    flex: 1, // Garante que o container da mensagem ocupe o espaço inteiro
    justifyContent: "center", // Centraliza a mensagem no eixo vertical
    alignItems: "center", // Centraliza a mensagem no eixo horizontal
  },
  semAgendamentos: {
    fontSize: 16,
    color: "#999",
    alignSelf: "center",
  },
  lista: {
    paddingBottom: 10, // Adiciona espaçamento na lista se necessário
    backgroundColor: "red",
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    backgroundColor: "#13213c",
    borderBottomLeftRadius: 30, // Bordas arredondadas inferiores
    borderBottomRightRadius: 30, // Bordas arredondadas inferiores
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    paddingBottom: 20,
    paddingTop: 20
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingTop: 20,
    paddingLeft: 20,
  },

  texts: {
    flexDirection: "column",
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25, // Logo arredondada
    marginRight: 10,
  },
  shopName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  shopName_: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  newAppointmentButton: {
    backgroundColor: "#0045a0",
    paddingVertical: 10,
    paddingHorizontal: 100,
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 10,
  },
  newAppointmentText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  monthText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase", // Para capitalizar o nome do mês
  },
  arrow: {
    fontSize: 24,
    paddingHorizontal: 10,
    color: "#13213c",
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  dayContainer: {
    width: 60,
    // height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  selectedDayContainer: {
    backgroundColor: "#00adf5",
  },
  dayName: {
    fontSize: 16,
    color: "#333",
    textTransform: "capitalize", // Capitalizar o nome do dia
  },
  dayNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    color: "green",
  },

  // ESTILO DE "TODOS OS AGENDAMENTOS"

  titulo: {
    fontSize: 19,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#000000",
    paddingTop: 20,
  },
  lista: {
    paddingBottom: 20,
  },
  agendamento: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  imagemServico: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  horario: {
    fontSize: 16,
    color: "#555",
    marginVertical: 5,
  },
  data: {
    fontSize: 16,
    color: "#555",
    marginVertical: 5,
    fontWeight: "600",
    color: "#000000",
  },
  servico: {
    fontSize: 16,
    color: "#555",
    paddingTop: 2,
  },
  botoes: {
    flexDirection: "row",
  },
  botaoEditar: {
    backgroundColor: "#0045a0",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  botaoExcluir: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default AppointmentSlider;
