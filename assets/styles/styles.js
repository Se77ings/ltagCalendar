import { StyleSheet } from "react-native";
import { shadow } from "react-native-paper";

const styles = StyleSheet.create({
	iconDiv: {
		borderWidth: 1.5,
		borderColor: "white",
		borderRadius: 50,
		padding: 5,
		height: 36,
		marginTop: 5,
		alignSelf: "center",
	  },
	lightHeader: {
		padding: 15,
		backgroundColor: "#f0f0f0",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
	  },
	  darkHeader: {
		padding: 15,
		backgroundColor: "#333",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
	  },
	cardStyle: {
		flexDirection: "col",
		width: "100%",
		height: 85,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 12,
		marginBottom: 20,
		backgroundColor: "#0055c6",
		color: "white",
	},
	agendamentoAtrasado: {
		backgroundColor: "#ffdbdb",
		borderStyle: "solid",
	},

	agendamentoFinalizado: {
		backgroundColor: "#dbffdb",
	},

	containerFlatList: {
		flex: 1,
		justifyContent: "center",
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	semAgendamentos: {
		fontSize: 16,
		color: "#999",
		alignSelf: "center",
	},
	lista: {
		paddingBottom: 10,
	},

	container: {
		height: "100%",
	},
	headerContainer: {
		borderBottomLeftRadius: 40,
		borderBottomRightRadius: 40,
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
		paddingLeft: 20,
		width: "100%",
	},

	logo: {
		width: 50,
		height: 50,
		borderRadius: 25,
		marginRight: 10,
	},
	shopName: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#ffffff",
		textAlign: "left",
		
		maxWidth: 250,
	},
	shopName_: {
		
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
		textTransform: "uppercase",
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
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 5,
		borderRadius: 10,
		paddingVertical: 5
	},
	dayName: {
		fontSize: 16,
		color: "#333",
		textTransform: "capitalize",
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

	agendamento: {
		borderRadius: 10,
		padding: 15,
		margin: 10,
		flexDirection: "row",
		alignItems: "center",

		shadowOpacity: 0.1,
		shadowRadius: 50,
		elevation: 5,
	},
	imagemServico: {
		width: '100%',
		height: '100%',
		borderRadius: 10,
		marginRight: 15,
	},
	info: {
		marginLeft:15,
		flex: 1
	},
	nome: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
	},
	horario: {
		fontSize: 16,
		color: "#555",
	},
	data: {
		fontSize: 16,
		color: "#555",
		fontWeight: "600",
		color: "#000000",
	},
	servico: {
		fontSize: 16,
		color: "#555",
		paddingTop: 2,
	},
	botoes: {
		gap:10,
		flexDirection: "column",
	},
	botao: {
		borderRadius: 10,
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
		borderColor: "#ddd",
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "#F3F4F6",
		padding: 10,
		borderRadius: 5,
		marginVertical: 5,
	},
	infoLabel: {
		fontSize: 16,
		color: "#312fbf",
		marginLeft: 5,
		flex: 1,
	},
	infoValue: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
		flex: 1,
		textAlign: "right",
	},
	themeToggleButton: {
		padding: 10,
		backgroundColor: "#312fbf",
		borderRadius: 5,
		alignItems: "center",
		marginVertical: 10,
	  },
	  themeToggleText: {
		color: "white",
		fontSize: 16,
	  },
});


export default styles;
