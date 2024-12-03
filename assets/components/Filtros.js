import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";

const Filtros = ({ filtroSelecionado, setFiltroSelecionado, lista }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const { theme } = useTheme();
  const textColor = theme === "dark" ? "white" : "black";
  const fundoInput = theme === "dark" ? "#2F407A" : "white";
  const ColorInput = theme === "dark" ? "#666699" : "black";
  const buttons = theme === "dark" ? "#2F407A" : "#312fbf";

  // Busca o label correspondente ao filtro selecionado
  const filtroAtualLabel =
    lista.find((item) => item.id === filtroSelecionado)?.label ||
    "Selecione um filtro";

  const handleFiltroSelecionado = (filtroId) => {
    setFiltroSelecionado(filtroId); // Armazena o ID da opção
    setModalVisible(false); // Fecha o modal
  };

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        style={[styles.dropdown, { backgroundColor: fundoInput }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.dropdownText, { color: textColor }]}>
          {filtroAtualLabel}
        </Text>
        <Ionicons name="chevron-down" size={20} color={textColor} />
      </TouchableOpacity>

      {/* Modal para exibir as opções */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione um filtro</Text>
            <FlatList
              data={lista}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleFiltroSelecionado(item.id)} // Passa o ID ao invés do label
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  dropdownText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 20,
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#312fbf",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default Filtros;
