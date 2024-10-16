import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView, Alert, Image, Modal, Pressable, Button, InteractionManager } from "react-native";
import styles from "../../assets/styles/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import DropdownSelector from "../../assets/components/DropdownSelector";
import { ObterServicosPorFavorito } from "../../database/servicoRepository";

const Atendimento = ({ agendamentoSelecionado, formatarData, setmodalCompleteAgendamento }) => {
  const [todosServicos, setTodosServicos] = useState([]);
  const [todosColaboradores, setTodosColaboradores] = useState([]);
  const [servicosSelecionados, setServicosSelecionados] = useState([]);
  const [colaboradoresSelecionados, setColaboradoresSelecionados] = useState([]);

  useEffect(() => {
    ObterServicosPorFavorito().then((result) => {
    });
  }, []);

  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
      }}>
      <TouchableOpacity
        style={{ position: "absolute", top: 10, right: 10, zIndex: 1, backgroundColor: "#312fbf", borderRadius: 15, padding: 0 }}
        onPress={() => {
          setmodalCompleteAgendamento(false);
        }}>
        <Ionicons name="close" size={24} color="#fff" />
      </TouchableOpacity>
      <Text
        style={{
          textAlign: "center",
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 20,
          color: "#312fbf",
        }}>
        Atendimento
      </Text>

      <View style={{ marginBottom: 20 }}>
        <View style={styles.infoRow}>
          <Ionicons name="document-text-outline" size={20} color="#312fbf" />
          <Text style={styles.infoLabel}>Agendamento nº:</Text>
          <Text style={styles.infoValue}>{agendamentoSelecionado.id}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={20} color="#312fbf" />
          <Text style={styles.infoLabel}>Cliente:</Text>
          <Text style={styles.infoValue}>{agendamentoSelecionado.Nome}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#312fbf" />
          <Text style={styles.infoLabel}>Data:</Text>
          <Text style={styles.infoValue}>
            {formatarData(agendamentoSelecionado.Data)} às {agendamentoSelecionado.Hora}
          </Text>
        </View>
        <Text style={styles.infoLabel}>Serviço(s):</Text>
        <DropdownSelector lista={todosServicos} label={"Serviço(s)"} icone={"briefcase-outline"} callbackSelecionados={setServicosSelecionados} selectedItems={servicosSelecionados} opt={"servico"} />
        {/* <DropdownSelector lista={todosColaboradores} label={"Colaborador(es)"} icone={"person-outline"} callbackSelecionados={setColaboradoresSelecionados} selectedItems={colaboradoresSelecionados} opt={"colaborador"}/> */}
      </View>

      <TouchableOpacity
        onPress={() => setmodalCompleteAgendamento(false)}
        style={{
          backgroundColor: "#312fbf",
          paddingVertical: 15,
          borderRadius: 5,
          alignItems: "center",
          marginTop: 20,
        }}>
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Finalizar</Text>
      </TouchableOpacity>
    </View>
  );
};
export default Atendimento;
