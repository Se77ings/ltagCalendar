import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeContext";
import Filtros from "../../assets/components/Filtros";
import { filtrarClientes } from "../../services/agendamentoService";
import DateTimePicker from "@react-native-community/datetimepicker";

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [filtroSelecionado, setFiltroSelecionado] = useState("todo");
  const [intervalo, setIntervalo] = useState({ dataInicio: null, dataFim: null });
  const [nomeCliente, setNomeCliente] = useState("");
  const [showDataInicio, setShowDataInicio] = useState(false);
  const [showDataFim, setShowDataFim] = useState(false);

  const { theme } = useTheme();
  const textColor = theme === "dark" ? "white" : "black";

  const renderCliente = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, theme === "dark" ? styles.cardDark : styles.cardLight]}
    >
      <View style={styles.cardContent}>
        <Text style={[styles.clienteNome, { color: textColor }]}>{item.nome}</Text>
        <Text style={[styles.clienteInfo, { color: textColor }]}>{item.telefone}</Text>
      </View>
      <Ionicons name="person-circle" size={32} color={theme === "dark" ? "white" : "gray"} />
    </TouchableOpacity>
  );

  const carregarClientes = async () => {
    try {
      const { dataInicio, dataFim } = intervalo;
      const clientesFiltrados = await filtrarClientes(filtroSelecionado, dataInicio, dataFim, nomeCliente);
      setClientes(clientesFiltrados);
    } catch (error) {
      // console.error("Erro ao carregar clientes:", error);
    }
  };

  useEffect(() => {
    if (filtroSelecionado === "personalizado" && !intervalo.dataInicio && !intervalo.dataFim) {
      const hoje = new Date();
      const umMesAntes = new Date(hoje);
      umMesAntes.setMonth(hoje.getMonth() - 1);

      setIntervalo({
        dataInicio: umMesAntes,
        dataFim: hoje,
      });
    } else {
      carregarClientes();
    }
  }, [filtroSelecionado, intervalo, nomeCliente]);

  const opcoes = [
    { id: "todo", label: "Todo o período" },
    { id: "ultimaSemana", label: "Última semana" },
    { id: "ultimos30Dias", label: "Últimos 30 dias" },
    { id: "ultimos3Meses", label: "Últimos 3 meses" },
    { id: "anoPassado", label: "Ano Passado" },
    { id: "personalizado", label: "Intervalo personalizado" },
  ];

  const handleDataChange = (event, selectedDate, tipo) => {
    setShowDataInicio(false);
    setShowDataFim(false);
    const currentDate = selectedDate || intervalo[tipo];
    if (tipo === "dataInicio") {
      setIntervalo({ ...intervalo, dataInicio: currentDate });
    } else if (tipo === "dataFim") {
      setIntervalo({ ...intervalo, dataFim: currentDate });
    }
    if (tipo === "dataInicio") {
      setShowDataInicio(false);
    } else if (tipo === "dataFim") {
      setShowDataFim(false);
    }

  };

  return (
    <View style={[styles.container, theme === "dark" ? styles.containerDark : styles.containerLight]}>
      <Text style={[styles.title, { color: textColor }]}>Clientes com Agendamentos</Text>

      <TextInput
        style={[styles.input, { color: textColor, borderColor: textColor }]}
        placeholder="Buscar pelo nome"
        placeholderTextColor={theme === "dark" ? "#AAA" : "#666"}
        value={nomeCliente}
        onChangeText={(text) => setNomeCliente(text)}
      />

      <Filtros
        filtroSelecionado={filtroSelecionado}
        setFiltroSelecionado={(filtro) => {
          setFiltroSelecionado(filtro);
          if (filtro !== "personalizado") {
            setIntervalo({ dataInicio: null, dataFim: null });
          }
        }}
        lista={opcoes}
        setIntervalo={setIntervalo}
      />

      {filtroSelecionado === "personalizado" && (
        <View style={styles.datePickerContainer}>
          <Text style={[styles.label, { color: textColor }]}>Data Início:</Text>
          <TouchableOpacity onPress={() => setShowDataInicio(true)}>
            <Text style={[styles.dateText, { color: textColor }]}>
              {intervalo.dataInicio ? intervalo.dataInicio.toLocaleDateString() : "Selecione a data"}
            </Text>
          </TouchableOpacity>

          {showDataInicio && (
            <DateTimePicker
              value={intervalo.dataInicio || new Date()}
              mode="date"
              display="default"
              onChange={(e, date) => handleDataChange(e, date, "dataInicio")}
            />
          )}

          <Text style={[styles.label, { color: textColor }]}>Data Fim:</Text>
          <TouchableOpacity onPress={() => setShowDataFim(true)}>
            <Text style={[styles.dateText, { color: textColor }]}>
              {intervalo.dataFim ? intervalo.dataFim.toLocaleDateString() : "Selecione a data"}
            </Text>
          </TouchableOpacity>

          {showDataFim && (
            <DateTimePicker
              value={intervalo.dataFim || new Date()}
              mode="date"
              display="default"
              onChange={(e, date) => handleDataChange(e, date, "dataFim")}
            />
          )}
        </View>
      )}

      {clientes.length > 0 ? (
        <FlatList
          data={clientes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCliente}
        />
      ) : (
        <Text style={[styles.noData, { color: textColor }]}>Nenhum cliente encontrado.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  containerDark: {
    backgroundColor: "#020C2A",
  },
  containerLight: {
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  noData: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
    borderRadius: 10,
  },
  cardDark: {
    backgroundColor: "#1A1A2E",
  },
  cardLight: {
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardContent: {
    flex: 1,
    marginRight: 8,
  },
  clienteNome: {
    fontSize: 18,
    fontWeight: "bold",
  },
  clienteInfo: {
    fontSize: 14,
    marginTop: 4,
  },
  datePickerContainer: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 16,
  },
});

export default ListaClientes;
