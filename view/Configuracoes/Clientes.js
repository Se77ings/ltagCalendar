import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeContext";
import Filtros from "../../assets/components/Filtros";

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [filtroSelecionado, setFiltroSelecionado] = useState(""); // Estado para o filtro selecionado

  const { theme } = useTheme();
  const textColor = theme === "dark" ? "white" : "black";

  const renderCliente = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, theme === "dark" ? styles.cardDark : styles.cardLight]}
      onPress={() => Alert.alert("Cliente", `Detalhes de ${item.nome}`)}
    >
      <View style={styles.cardContent}>
        <Text style={[styles.clienteNome, { color: textColor }]}>{item.nome}</Text>
        <Text style={[styles.clienteInfo, { color: textColor }]}>{item.telefone}</Text>
      </View>
      <Ionicons name="person-circle" size={32} color={theme === "dark" ? "white" : "gray"} />
    </TouchableOpacity>
  );

  useEffect(() => {
    // Lista estática para fins de teste
    const clientesTeste = [
      { id: 1, nome: "Maria Silva", email: "maria.silva@gmail.com", telefone: "123-456-7890" },
      { id: 2, nome: "João Pereira", email: "joao.pereira@yahoo.com", telefone: "987-654-3210" },
      { id: 3, nome: "Ana Souza", email: "ana.souza@outlook.com", telefone: "555-666-7777" },
    ];
    setClientes(clientesTeste);
  }, []);

  const opcoes = [
    { id: "1", label: "Todo o período" },
    { id: "2", label: "Últimos 30 dias" },
    { id: "3", label: "Agosto/2024" },
    { id: "4", label: "2023" },
    { id: "5", label: "Intervalo personalizado" },
  ];

  return (
    <View style={[styles.container, theme === "dark" ? styles.containerDark : styles.containerLight]}>
      <Text style={[styles.title, { color: textColor }]}>Clientes com Agendamentos</Text>

      {/* Adicione o componente de filtros */}
      <Filtros
        filtroSelecionado={filtroSelecionado}
        setFiltroSelecionado={setFiltroSelecionado}
        lista={opcoes}
      />

      {/* Lista de clientes */}
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
