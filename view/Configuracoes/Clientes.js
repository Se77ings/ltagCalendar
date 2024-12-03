import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeContext";
import Filtros from "../../assets/components/Filtros";
import { obterClientes } from "../../database/agendamentoRepository";
import { filtrarClientes } from "../../services/agendamentoService";

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [filtroSelecionado, setFiltroSelecionado] = useState("todo"); 
  const [intervalo, setIntervalo] = useState({ dataInicio: null, dataFim: null });

  const { theme } = useTheme();
  const textColor = theme === "dark" ? "white" : "black";

  const renderCliente = ({ item }) => ( 
    <TouchableOpacity
      style={[styles.card, theme === "dark" ? styles.cardDark : styles.cardLight]}
      // onPress={() => Alert.alert("Cliente", `Detalhes de ${item.nome}`)} //TODO: ver se vai colocar algo em detalhes
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
      const clientesFiltrados = await filtrarClientes(filtroSelecionado, dataInicio, dataFim);
      setClientes(clientesFiltrados);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, [filtroSelecionado, intervalo]); // Atualiza sempre que o filtro ou intervalo mudar

  const opcoes = [
    { id: "todo", label: "Todo o período" },
    { id: "ultimaSemana", label: "Última semana" },
    { id: "ultimos30Dias", label: "Últimos 30 dias" },
    { id: "ultimos3Meses", label: "Últimos 3 meses" },
    { id: "anoPassado", label: "Ano Passado" },

    { id: "personalizado", label: "Intervalo personalizado" },
  ];

  return (
    <View style={[styles.container, theme === "dark" ? styles.containerDark : styles.containerLight]}>
      <Text style={[styles.title, { color: textColor }]}>Clientes com Agendamentos</Text>

      {/* Componente de filtros */}
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

      {}
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
});

export default ListaClientes;
