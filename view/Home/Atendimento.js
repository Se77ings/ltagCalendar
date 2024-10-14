import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView, Alert, Image, Modal, Pressable, Button, InteractionManager } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import initializaDatabase from "../../database/initializeDatabase";
import adicionarAgendamento, { obterAgendamentos, RemoverAgendamentoAsync } from "../../services/agendamentoService";
import { ObterServicosPorColaboradorAsync, ObterTodosServicosAsync } from "../../services/servicoService";
import SectionedMultiSelect from "react-native-sectioned-multi-select";

import styles from "../../assets/styles/styles";
import Ionicons from "@expo/vector-icons/Ionicons";

const Atendimento = ({ agendamentoSelecionado, formatarData, setmodalCompleteAgendamento }) => {
  const [todosServicos, setTodosServicos] = useState([]);

  const fakeData = [
    {
      name: "Favoritos",
      id: 0,
      children: [
        { name: "Colaborador A", id: 20 },
        { name: "Colaborador B", id: 21 },
      ],
    },
    {
      name: "Outros",
      id: 1,
      children: [
        { name: "Colaborador C", id: 22 },
        { name: "Colaborador D", id: 23 },
        { name: "Colaborador E", id: 24 },
        { name: "Colaborador F", id: 25 },
      ],
    },
  ];

  async function obterServicos() {
    const result = [
      {
        name: "Serviços",
        id: 0,
        children: [
          { name: "Serviço A", id: 1 },
          { name: "Serviço B", id: 2 },
        ],
      },
    ];

    setTodosServicos(result);
  }

  useEffect(() => {
    obterServicos();
  }, []);

  const DropdownSelector = ({ lista, label, icone }) => {
    console.log("Recebi a lista:");
    console.log(lista);
    const [itemSelecionado, setItemSelecionado] = useState([]);

    useEffect(() => {
      console.log("Item selecionado:");
      console.log(itemSelecionado);
    }, [itemSelecionado]);
    return (
      <SectionedMultiSelect
        items={lista}
        uniqueKey="id"
        subKey="children"
        selectText={label}
        showDropDowns={false}
        readOnlyHeadings={true}
        onSelectedItemsChange={setItemSelecionado}
        selectedItems={itemSelecionado}
        IconRenderer={Ionicons}
        selectToggleIconComponent={<Ionicons name="arrow-down" size={20} color="#312fbf" />}
        dropDownToggleIconDownComponent={<Ionicons name="arrow-down" size={20} color="#312fbf" />}
        dropDownToggleIconUpComponent={<Ionicons name="arrow-up" size={20} color="#312fbf" />}
        selectedIconComponent={<Ionicons name="checkmark" size={20} color="#312fbf" />}
        renderSelectText={() => {
          return (
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Ionicons name={icone} size={20} color="#312fbf" />
              {itemSelecionado.length === 0 ? (
                <Text style={{ color: "#312fbf", fontSize: 16, marginLeft: 5 }}>Selecione {label}</Text>
              ) : (
                <Text style={{ color: "#312fbf", fontSize: 16, marginLeft: 5 }}>
                  {itemSelecionado.length} {label} selecionado(s)
                </Text>
              )}
            </View>
          );
        }}
        styles={{
          selectToggle: {
            backgroundColor: "#F3F4F6",
            borderColor: "#312fbf",
            padding: 10,
            borderRadius: 5,
            marginTop: 5,
            marginBottom: 10,
            justifyContent: "space-between",
          },
          selectToggleText: {
            color: "#312fbf",
            fontSize: 16,
            fontWeight: "500",
          },
          item: {
            backgroundColor: "#FFFFFF",
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderBottomWidth: 1,
            borderColor: "#f0f0f0",
            marginVertical: 3,
          },
          selectedItem: {
            backgroundColor: "#e6eaff",
          },
          chipContainer: {
            backgroundColor: "#312fbf",
            borderWidth: 0,
          },
          chipText: {
            color: "#FFFFFF",
          },
          button: {
            backgroundColor: "#312fbf",
            padding: 10,
            borderRadius: 5,
          },
          confirmText: {
            color: "#FFFFFF",
          },
          subItem: {
            marginVertical: 3,
          },
        }}
        colors={{
          primary: "#312fbf",
          success: "#4caf50",
          cancel: "#1A1A1A",
          text: "#2e2e2e",
          selectToggleTextColor: "#312fbf",
          itemBackground: "#fff",
          subItemBackground: "#ffffff",
        }}
      />
    );
  };
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
        <DropdownSelector lista={todosServicos} label="serviço(s)" icone={"briefcase-outline"} />
        <DropdownSelector lista={fakeData} label={"colaborador(es)"} icone={"people-outline"} />
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
