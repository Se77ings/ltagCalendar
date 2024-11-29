import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView, Alert, Image, Modal, Pressable, Button, Animated, Keyboard } from "react-native";
import moment from "moment";
import "moment/locale/pt-br";
import NovoAgendamento from "./NovoAgendamento";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import initializaDatabase from "../../database/initializeDatabase";
import { obterAgendamentos, RemoverAgendamentoAsync } from "../../services/agendamentoService";
import styles from "../../assets/styles/styles";
import Header from "../../assets/components/Header";
import Ionicons from "@expo/vector-icons/Ionicons";
import agendamentoCompleted from "../../assets/icon/agendamentoCompleted.png";
import calendario from "../../assets/icon/calendario.png";
import { DesvincularAgendamentoServicos } from "../../database/agendamentoRepository";
import { useTheme } from "../../ThemeContext"; // Usando o hook useTheme para acessar o estado do tema
import { TourGuideProvider, TourGuideZone, TourGuideZoneByPosition, useTourGuideController } from "rn-tourguide";
import CadastroInicial from "./CadastroInicial";
import { ObterEstabelecimentoAsync } from "../../services/estabelecimentoService";

const formatarData = (data) => {
	const partes = data.split("-");
	return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

const SliderData = ({ flatListRef, selectedDate, setSelectedDate, scrollToDay, setShowAtendidos }) => {
	const [days, setDays] = useState([]);
	const [currentMonth, setCurrentMonth] = useState(moment());
	useEffect(() => {
		let hoje = moment();
		hojeOBJ = {
			day: hoje.format("DD"),
			dayName: hoje.format("ddd"),
			fullDate: hoje.format("YYYY-MM-DD"),
		};

		const timeoutId = setTimeout(() => {
			if (flatListRef.current && days.length > 0) {
				const index = days.findIndex((day) => day.fullDate === hojeOBJ.fullDate);
				if (index !== -1) {
					flatListRef.current.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
					setSelectedDate(hojeOBJ);
				} else {
					flatListRef.current.scrollToIndex({ index: 0, animated: true, viewPosition: 0.5 });
					setSelectedDate(days[0]);
				}
			}
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [days]);

	useEffect(() => {
		generateDays();
	}, [currentMonth]);
	const goToPreviousMonth = () => {
		setCurrentMonth(currentMonth.clone().subtract(1, "month"));
	};

	const goToNextMonth = () => {
		setCurrentMonth(currentMonth.clone().add(1, "month"));
	};

	const generateDays = () => {
		let daysArray = [];
		const totalDays = currentMonth.daysInMonth();

		for (let i = 1; i <= totalDays; i++) {
			const date = currentMonth.date(i);
			daysArray.push({
				day: date.format("DD"),
				dayName: date.format("ddd"),
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
			onPress={async () => {
				await setShowAtendidos(false);

				onDayPress(item);
			}}>
			<Text style={[{ color: textColor }, item.fullDate === selectedDate.fullDate && { color: textColorSelected }]}>{item.dayName}</Text>
			<Text style={[[styles.dayNumber, { color: textColor }], item.fullDate === selectedDate.fullDate && { color: textColorSelected }]}>{item.day}</Text>
		</TouchableOpacity>
	);

	const ITEM_HEIGHT = 70;
	const getItemLayout = (data, index) => ({
		length: ITEM_HEIGHT,
		offset: ITEM_HEIGHT * index,
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

	const { theme, toggleTheme } = useTheme();

	// Estilos baseados no tema atual
	const headerStyles = theme === "dark" ? styles.darkHeader : styles.lightHeader;
	const textColor = theme === "dark" ? "white" : "black";
	const textColorSelected = theme === "dark" ? "#94A2CF" : "#312fbf";
	return (
		//aqui
		<View>
			<View style={[styles.header, { color: textColor }]}>
				<TouchableOpacity onPress={goToPreviousMonth}>
					<Text style={[styles.arrow, { color: textColor }]}>←</Text>
				</TouchableOpacity>
				<Text style={[styles.monthText, { color: textColor }]}>{currentMonth.format("MMMM YYYY")}</Text>
				<TouchableOpacity onPress={goToNextMonth}>
					<Text style={[styles.arrow, { color: textColor }]}>→</Text>
				</TouchableOpacity>
			</View>

			<View>
				<View style={{ borderTopWidth: 0.5, marginHorizontal: 20, borderColor: textColor }} />

				<FlatList
					ref={flatListRef}
					getItemLayout={getItemLayout}
					onScrollToIndexFailed={handleScrollToIndexFailed}
					data={days}
					horizontal
					showsHorizontalScrollIndicator={false}
					keyExtractor={(item) => item.fullDate}
					renderItem={renderDay}
					contentContainerStyle={styles.listContainer}
				/>
				<View style={{ borderTopWidth: 0.5, marginHorizontal: 20, borderColor: textColor }} />
			</View>
		</View>
	);
};

const Cards = ({ img, data, setAgendamentoSelecionado, setmodalCreate, obter, setOption }) => {
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
		setOption("Editar");
		setmodalCreate(true);
	};

	const finalizarAgendamento = (item) => {
		setAgendamentoSelecionado(item);
		setOption("Finalizar");
		setmodalCreate(true);
	};

	const getLocalTime = () => {
		const now = new Date();
		const localTime = new Intl.DateTimeFormat("pt-BR", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
			timeZone: "America/Sao_Paulo",
		}).format(now);
		return localTime;
	};

	const getLocalDate = () => {
		const now = new Date();
		const localDate = new Intl.DateTimeFormat("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			timeZone: "America/Sao_Paulo",
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
	// useEffect(() => {
	// 	console.log("data--->",data)
	// },[])
	
	const renderAgendamento = ({ item }) => (
		<View style={[[styles.agendamento, {backgroundColor:'white', height:100}], item.Finalizado ? styles.agendamentoFinalizado : isPast(formatarData(item.Data), item.Hora) ? styles.agendamentoAtrasado : null]}>
			<View style={{width:70,height:70, padding:5}}>
				<Image source={img} style={styles.imagemServico}/>
			</View>
			<View style={styles.info}>
				<Text style={styles.nome}>{item.Nome}</Text>
				<Text style={[styles.horario, item.Finalizado ? styles.agendamentoFinalizado : isPast(formatarData(item.Data), item.Hora) && { color: "red", fontWeight: "bold" }]}>Horário:{item.Hora}</Text>			
			</View>
			<View style={styles.botoes}>
				<TouchableOpacity
					style={[styles.botao, {}]}
					onPress={() => editarAgendamento(item)}>
					<Ionicons
						name="create-outline"
						color={"#0045a0"}
						size={22}
					/>
					{/* <Text>Editar</Text> */}
				</TouchableOpacity>
				{!item.Finalizado && (
					<>
						<TouchableOpacity
							style={[styles.botao, {}]}
							onPress={() => excluirAgendamento(item.id)}>
							<Ionicons
								name="trash"
								color={"#f44336"}
								size={22}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.botao, {}]}
							onPress={() => finalizarAgendamento(item)}>
							<Ionicons
								name="checkmark"
								color={"#008000"}
								size={22}
							/>
						</TouchableOpacity>
					</>
				)}
			</View>
		</View>
	);
	return (
		<FlatList
			data={data}
			renderItem={renderAgendamento}
			keyExtractor={(item) => item.id}
			contentContainerStyle={styles.lista}
			scrollEnabled={false}
		/>
	);
};

const Home = ({ navigation }) => {
	const [option, setOption] = useState("");
	moment.locale("pt-br");
	const [selectedDate, setSelectedDate] = useState("");
	const [agendamentoSelecionado, setAgendamentoSelecionado] = useState();
	const [modalCreate, setmodalCreate] = useState(false);
	const flatListRef = useRef(null);
	const [agendamentos, setAgendamentos] = useState([]);
	const [animatedHeight] = useState(new Animated.Value(0));
	const [showAtendidos, setShowAtendidos] = useState(false);
	const [atendidosHeight, setAtendidosHeight] = useState(0);
	const [primeiraInicializacao, setPrimeiraInicializacao] = useState(false);
	//hooks de controle do tour:
	const { canStart, start, stop, eventEmitter } = useTourGuideController();

	async function obter() {
		await setAgendamentos([]);
		var result = await obterAgendamentos();
		setAgendamentos(result.data);
		console.log("result--->", result)
		getAtendidosHeight(result.data.filter((agendamento) => agendamento.Finalizado === 1).length);
	}

	useFocusEffect(
		React.useCallback(() => {
			//Home focada, obter novamente..
			setTimeout(() => {
				obter();
			}, 100);
		}, [])
	);

	useEffect(() => {
		initialize();
		obter();
		setShowAtendidos(false);
	}, []);

	useEffect(() => {}, [animatedHeight]);

	const filterAgendamentos = (agendamento) => {
		return agendamento.filter((agendamento) => agendamento.Data === selectedDate.fullDate);
	};

	const scrollToDay = (item) => {
		setSelectedDate(item);

		flatListRef.current.scrollToItem({
			item: item,
			animated: true,
			viewPosition: 0.5,
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
		setOption("");
		obter();
	};

	const getAtendidosHeight = (qtd) => {
		if (qtd == 0) {
			setAtendidosHeight(0);
			return;
		}
		setAtendidosHeight(qtd * 150);
	};

	useEffect(() => {
		if (showAtendidos) {
			Animated.timing(animatedHeight, {
				toValue: atendidosHeight,
				duration: 300,
				useNativeDriver: false,
			}).start();
		} else {
			Animated.timing(animatedHeight, {
				toValue: 0,
				duration: 300,
				useNativeDriver: false,
			}).start();
		}
	}, [showAtendidos, atendidosHeight]);

	const toggleAtendidos = () => {
		let qtd = filterAgendamentos(agendamentos.filter((agendamento) => agendamento.Finalizado === 1)).length;
		getAtendidosHeight(qtd);

		setShowAtendidos(!showAtendidos);
	};
	//TOUR:
	//ainda nao tenho a logica para iniciar ou finalizar.
	// mas  assim que finalizar, devo exibir a tela para o cadastro de dados iniciais

	//meta: no final de semana, vou terminar os seguintes tópicos:
	// Criar a tela para cadastrar dados iniciais. Usar o modal por enquanto, e ver se precisa de uma tela nova.
	// pensar no trigger que vai verificar se é o primeiro acesso ou não (provavelmente uma consulta no banco, se há dados iniciais...)
	// Criar uma tela de controle de ramos (CRUD)

	useEffect(() => {


		if (canStart) {
			eventEmitter.on("stepChange", handleOnStepChange);
			ObterEstabelecimentoAsync().then((result) => {
				if (result.success) {
					if (result.data == null) {
						start();
					}
				}
			});
			eventEmitter.on("stop", () => {
				//Tour finalizado
				setPrimeiraInicializacao(true);
			});
		}
	}, [canStart]);

	function handleOnStepChange(step) {
		if (step !== undefined && step !== null) {
			switch (step.name) {
				case "2":
					break;
				case "4":
					navigation.navigate("ConfigScreen");

					break;
			}
		} else {
		}
	}

	const { theme, toggleTheme } = useTheme();

	// Estilos baseados no tema atual
	const headerStyles = theme === "dark" ? styles.darkHeader : styles.lightHeader;
	const textColor = theme === "dark" ? "white" : "black";

	return (
		<>
			<TourGuideZone
				zone={1}
				text={"Olá, seja bem vindo ao LTAG Calendar, notei que é seu primeiro acesso. Siga os passos para aprender as principais funcionalidades do aplicativo. 😁"}
				borderRadius={0}
				maskOffset={0}
			/>
			<View style={styles.container}>
				<TouchableOpacity
					style={{ position: "absolute", bottom: 10, right: 10, zIndex: 50 }}
					onPress={() => navigation.navigate("NovoAgendamento")}>
					<Ionicons
						name="add-circle"
						size={50}
						color={textColor}	
					/>
				</TouchableOpacity>
				<ScrollView
					stickyHeaderIndices={[1]}
					contentContainerStyle={{}}>
					<Header
						title={"Menu Inicial"}
						primeiraInicializacao={primeiraInicializacao}
					/>
					<View style={{ paddingBottom: 10 }}>
						<TourGuideZone
							zone={2}
							text={"Aqui você consegue navegar entre as datas que deseja realizar seu agendamento"}
							borderRadius={12}
							maskOffset={10}>
							<SliderData
								flatListRef={flatListRef}
								selectedDate={selectedDate}
								setSelectedDate={setSelectedDate}
								scrollToDay={scrollToDay}
								setShowAtendidos={setShowAtendidos}
							/>
						</TourGuideZone>
						{/* <Button
							title="TESTAR"
							onPress={() => {
								start();
							}}
						/> */}
						<Text style={[styles.titulo, { color: textColor }]}>MEUS AGENDAMENTOS</Text>
					</View>
					{filterAgendamentos(agendamentos.filter((agendamento) => agendamento.Finalizado === 1)).length != 0 && (
						<Pressable
							style={{ flex: 1, flexDirection: "row", alignSelf: "center", justifyContent: "space-around", alignItems: "center"}}
							onPress={toggleAtendidos}>
							<Ionicons
								name={showAtendidos ? "arrow-up" : "arrow-down"}
								size={20}
								color="#312fbf"
							/>
							<Text style={{ marginHorizontal: 40, marginVertical: 15 }}>Agendamentos atendidos</Text>
							<Ionicons
								name={showAtendidos ? "arrow-up" : "arrow-down"}
								size={20}
								color="#312fbf"
							/>
						</Pressable>
					)}
					<Animated.View style={{ width: "100%", flex: 1, height: animatedHeight, overflow: "hidden"}}>
						<View style={{ minHeight: 100, borderWidth: 0, borderRadius: 20, marginBottom: 0 }}>
							{showAtendidos && (
								<>
									<Cards
										img={agendamentoCompleted}
										data={filterAgendamentos(agendamentos.filter((agendamento) => agendamento.Finalizado === 1))}
										setAgendamentoSelecionado={setAgendamentoSelecionado}
										setOption={setOption}
										setmodalCreate={setmodalCreate}
										obter={obter}
									/>

									<View style={{ width: "80%", borderWidth: 0.5, alignSelf: "center" }} />
								</>
							)}
						</View>
					</Animated.View>
					{filterAgendamentos(agendamentos.filter((agendamento) => agendamento.Finalizado === 0)).length != 0 ? (
						<>
							<Cards
								img={calendario}
								data={filterAgendamentos(agendamentos.filter((agendamento) => agendamento.Finalizado === 0))}
								setAgendamentoSelecionado={setAgendamentoSelecionado}
								setOption={setOption}
								setmodalCreate={setmodalCreate}
								obter={obter}
							/>
						</>
					) : (
						<View style={{ flex: 1, justifyContent: "center" }}>
							<Text style={{ textAlign: "center", marginTop: 20, color: textColor }}>Não há agendamentos para este dia</Text>
							<Text style={{ textAlign: "center", marginTop: 0, color: textColor }}>Utilize o item abaixo para adicionar um agendamento.</Text>
						</View>
					)}
				</ScrollView>
				<TourGuideZone
					style={{ position: "absolute", width: 80, height: 50, bottom: "-7%", right: "15%" }}
					zone={3}
					text="Ao clicar aqui para você tem acesso às configurações"
				/>
			</View>
			<Modal
				visible={modalCreate}
				transparent={true}
				animationType="slide">
				<Pressable
					onPress={() => {
						setmodalCreate(false);
						setOption("");
					}}
					style={{ height: "100%", backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center" }}>
					<Pressable>
						<NovoAgendamento
							AgendamentoSelecionado={agendamentoSelecionado}
							option={option}
							CompleteAgendamento={agendamentoSelecionado}
							fecharModal={fecharModal}
						/>
					</Pressable>
				</Pressable>
			</Modal>
			<Modal
				visible={primeiraInicializacao}
				transparent>
				<Pressable
					onPress={() => Keyboard.dismiss()}
					style={{ backgroundColor: "rgba(0,0,0,0.5)", height: "100%", flex: 1, justifyContent: "center", padding: 8 }}>
					<Pressable style={{ padding: 5, borderRadius: 6 }}>
						<CadastroInicial setPrimeiraInicializacao={setPrimeiraInicializacao} />
					</Pressable>
				</Pressable>
			</Modal>
			{/* <EscolherRamo /> */}
		</>
	);
};

const Main = () => {
	const Stack = createStackNavigator();

	return (
		<Stack.Navigator initialRouteName="Main">
			<Stack.Screen
				name="Home"
				component={Home}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="NovoAgendamento"
				component={NovoAgendamento}
				options={{ headerTitle: "Novo Agendamento", headerTitleAlign: "center" }}
			/>
		</Stack.Navigator>
	);
};

export default Main;