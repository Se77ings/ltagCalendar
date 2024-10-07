import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  cardStyle: {
    flexDirection: "col",
    width: "50%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#14213d",
    color:"white"
  },
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
    backgroundColor: "#fff",
    // borderWidth:1,
    height: "100%",
    borderColor: "red",
  },
  headerContainer: {
    backgroundColor: "#13213c",
    borderBottomLeftRadius: 30, // Bordas arredondadas inferiores
    borderBottomRightRadius: 30, // Bordas arredondadas inferiores
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    paddingBottom: 20,
    paddingTop: 25,
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignSelf: "center",
    marginBottom: 10,
    marginTop: 30, //não é o ideal!
    paddingLeft: 20,
    // borderWidth:1,
    // borderColor:"blue",
    width: "100%",
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
    textAlign: "left",
  },
  shopName_: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "left",
  },

  newAppointmentText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#0045a0",
    width: 43,
    height: 43,
    textAlign: "center",
    borderRadius: 50,
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
    marginVertical: 10,
  },

  dayContainer: {
    width: 60,
    // height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 10,
    // backgroundColor: "#f0f0f0",
    paddingVertical: 5,
  },

  selectedDay: {
    color: "#312fbf",
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
    backgroundColor: "#eee",
    borderRadius: 10,
    padding: 15,
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    // shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 50,
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
    // borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default styles;
