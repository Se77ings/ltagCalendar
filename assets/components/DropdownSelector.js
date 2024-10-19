import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView, Alert, Image, Modal, Pressable, Button, InteractionManager } from "react-native";
import SectionedMultiSelect from "react-native-sectioned-multi-select";

import Ionicons from "@expo/vector-icons/Ionicons";

const DropdownSelector = ({ lista, label, icone, callbackSelecionados, selectedItems = null, opt }) => {
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [dadosFormatados, setDadosFormatados] = useState([]);
  // selectedItems = [{"Afinidade": 1, "Descricao": "Corte de cabelo feminino", "Favorito": 0, "Nome": "Serviço B", "id": 2}, {"Afinidade": 1, "Descricao": "Corte de cabelo masculino", "Favorito": 1, "Nome": "Serviço A", "id": 1}]
  useEffect(() => {
    if (opt == "servico") {

      const favoritos = lista.filter((item) => item.Favorito === 1);
      const outros = lista.filter((item) => item.Favorito === 0);

      const dadosAgrupados = [
        {
          name: "Favoritos",
          id: "list0",
          children: favoritos.map(({ Nome, id }) => ({
            name: Nome,
            id,
          })),
        },
        {
          name: "Outros",
          id: "list1",
          children: outros.map(({ Nome, id }) => ({
            name: Nome,
            id,
          })),
        },
      ];
      setDadosFormatados(dadosAgrupados);
    } else if (opt == "colaborador") {
      const dadosAgrupados = [
        {
          name: "Colaboradores",
          id: "list0",
          children: lista.map(({ Nome, id }) => ({
            name: Nome,
            id,
          })),
        },
      ];
      setDadosFormatados(dadosAgrupados);
    }
  }, [lista]);

  useEffect(() => {
    callbackSelecionados(itensSelecionados);
  }, [itensSelecionados]);

  useEffect(() => {
    // console.log("selectedItems", selectedItems);
    if (selectedItems.length > 0) {
      selectedItems.forEach((item) => {
        itensSelecionados.push(item.id);
      });
    }
  }, []);
  return (
    <SectionedMultiSelect
      hideSearch={true}
      items={dadosFormatados}
      uniqueKey="id"
      confirmText="Selecionar"
      subKey="children"
      selectText={label}
      showDropDowns={false}
      readOnlyHeadings={true}
      onSelectedItemsChange={setItensSelecionados}
      selectedItems={itensSelecionados}
      IconRenderer={Ionicons}
      selectToggleIconComponent={<Ionicons name="arrow-down" size={20} color="#312fbf" />}
      dropDownToggleIconDownComponent={<Ionicons name="arrow-down" size={20} color="#312fbf" />}
      dropDownToggleIconUpComponent={<Ionicons name="arrow-up" size={20} color="#312fbf" />}
      selectedIconComponent={<Ionicons name="checkmark" size={20} color="#312fbf" />}
      renderSelectText={() => {
        return (
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Ionicons name={icone} size={20} color="#312fbf" />
            {itensSelecionados.length === 0 ? (
              <Text style={{ color: "#312fbf", fontSize: 16, marginLeft: 5 }}>Selecione {label}</Text>
            ) : (
              <Text style={{ color: "#312fbf", fontSize: 16, marginLeft: 5 }}>
                {itensSelecionados.length} {label} selecionado(s)
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

export default DropdownSelector;
