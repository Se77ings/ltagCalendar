import React, { useState, useEffect, useRef } from "react";
import { View, Text, Switch, TouchableOpacity, TextInput, Pressable, ScrollView, FlatList, StyleSheet, Alert, Animated } from "react-native";
import { useNavigation, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeContext"; // Usando o hook useTheme para acessar o estado do tema
import adicionarServico, { AtualizarServicoAsync, DesabilitarServicoAsync, ExisteAtendimentoComServicoAsync, ExisteServicoComColaboradorAsync, ObterTodosServicosAsync, ObterTodosServicosAtivosAsync, RemoverServicoAsync } from "../../services/servicoService";

const Estabelecimento = () => {
  <View contentContainerStyle={styles.container}>
    <View style={styles.scrollContainer}></View>
  </View>;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    paddingTop: 0,
    backgroundColor: "white", // Nova cor de fundo
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
  },
  closeButton: {
    position: "absolute",
    top: 10, // Distância do topo
    right: 10, // Distância da direita
    zIndex: 1,
    backgroundColor: "#666699",
    borderRadius: 15,
    padding: 0,
  },
  Header: {
    width: "100%",
    alignItems: "center",
  },
  scrollContainer: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#312fbf", // Nova cor
  },
  input: {
    height: 50,
    borderColor: "#ced4da",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 2,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 50,
    borderColor: "#ced4da",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    marginBottom: 2,
  },
  gridTitle: {
    fontSize: 20,
    margin: 0,
    fontWeight: "bold",
    color: "#666699",
  },
  gridContainer: {
    paddingHorizontal: 20,
  },
  ServicosCard: {
    padding: 15,
    borderWidth: 1,
    marginVertical: 7,
    borderColor: "#312fbf",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  ServicosCardDesabilitado: {
    padding: 15,
    borderWidth: 1,
    marginVertical: 15,
    borderColor: "#312fbf",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    backgroundColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  ServicosNome: {
    ffontWeight: "bold",
    fontSize: 16,
    color: "#14213b",
  },
  ServicosNomeDesabilitado: {
    ffontWeight: "bold",
    fontSize: 16,
    color: "red",
  },
});
export default Estabelecimento;
