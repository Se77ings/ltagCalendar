import React, { useState } from "react";
import { View, Text, TouchableOpacity, Button, StyleSheet, Alert } from "react-native";
import { FloatingLabelInput } from "react-native-floating-label-input";
import DropdownSelector from "../../assets/components/DropdownSelector";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { ramosDeAtividade } from "../../services/ramoService";
import adicionarEstabelecimentoAsync from "../../services/estabelecimentoService";

const CadastroInicial = ({ navigation }) => {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    logo: "",
  });
  const [erro, setErro] = useState({
    telefone: false,
  });
  const [image, setImage] = useState(null);

  const formatPhoneNumber = (input) => {
    let maskedValue = input;

    maskedValue = input.replace(/\D/g, "").slice(0, 11); // Remove não números e limita a 11 caracteres
    if (maskedValue.length == 10) {
      maskedValue = maskedValue.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else if (maskedValue.length == 11) {
      maskedValue = maskedValue.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else {
      maskedValue = maskedValue.replace(/\D/g, "");
    }
    return maskedValue;
  };

  const handleChange = (name, value) => {
    if (name == "telefone") {
      value = formatPhoneNumber(value);
      setFormData({ ...formData, [name]: value });
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSendData = () => {
    console.log(formData.telefone.length);
    if (formData.nome === "" || formData.telefone === "") {
      Alert.alert("Atenção", "Nome e telefone são obrigatórios"); // mudar depois
      return;
    }
    if (formData.telefone.length < 14 || formData.telefone.length > 15) {
      Alert.alert("Atenção", "Telefone inválido");
      setErro({ ...erro, telefone: true });

      setTimeout(() => {
        setErro({ ...erro, telefone: false });
      }, 3000);

      adicionarEstabelecimentoAsync(formData);
    }

    if (image) {
      formData.logo = image;
    }
    adicionarEstabelecimentoAsync(formData);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Dados Iniciais</Text>
      <Text style={{ textAlign: "center" }}>Agora, você precisa informar alguns dados iniciais</Text>
      <FloatingLabelInput labelStyles={styles.labelStyle} containerStyles={styles.input} label="Nome do Estabelecimento" value={formData.nome} onChangeText={(value) => handleChange("nome", value)} />
      <FloatingLabelInput keyboardType="numeric" hint="(17) 9999-9999" labelStyles={styles.labelStyle} containerStyles={styles.input} label="Telefone" value={formData.telefone} onChangeText={(value) => handleChange("telefone", value)} />
      {erro.telefone && <Text style={{ color: "red", paddingLeft: 15 }}>Telefone inválido</Text>}
      <FloatingLabelInput labelStyles={styles.labelStyle} containerStyles={styles.input} label="Endereço" value={formData.endereco} onChangeText={(value) => handleChange("endereco", value)} />
      <TouchableOpacity onPress={pickImage} style={{ flexDirection: "row", justifyContent: "space-between", padding: 10, paddingHorizontal: 20, borderWidth: 1, borderStyle: "dashed", borderRadius: 10, backgroundColor: image ? "#20bf55" : null }}>
        <View style={{ flexDirection: "column" }}>
          <Text style={{ alignSelf: "center", color: image ? "white" : "black", fontSize: 16 }}>Logotipo do seu estabelecimento</Text>
          <Text style={{ fontSize: 12, color: image ? "white" : "gray" }}>{image ? "Imagem Selecionada!" : "Clique aqui para enviar uma imagem"}</Text>
        </View>
        <Ionicons name={image ? "checkbox-outline" : "camera"} size={30} color={image ? "#fff" : "#000"} />
      </TouchableOpacity>
      <DropdownSelector label="Ramo de Atividade" callbackSelecionados={(value) => handleChange("ramoAtividade", value)} />
      <TouchableOpacity style={styles.submitButton} onPress={handleSendData}>
        <Text style={styles.submitButtonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexGrow: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
    justifyContent: "center",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#312fbf",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    height: 50,
    justifyContent: "center",
  },
  inputText: {
    color: "#333",
    fontSize: 16,
  },
  labelStyle: {
    color: "#312fbf",
  },
  picker: {
    backgroundColor: "#F3F4F6",
    borderRadius: 5,
    marginVertical: 10,
    height: 50,
  },
  submitButton: {
    backgroundColor: "#312fbf",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    marginTop: -8,
    paddingLeft: 10,
  },
  datePicker: {
    backgroundColor: "#F3F4F6",
    borderRadius: 5,
  },

  error: {
    color: "red",
    padding: 0,
    marginTop: 2,
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
});
/*
Nome do estabelecimento (obrigatório). Deve ser exibido na tela principal;
Telefone para contato (obrigatório);
Endereço (opcional);
Logotipo (opcional). Caso não seja informado, será utilizado o logotipo do aplicativo). Deve ser exibido na tela principal;
Ramo de atividade (geral, escritório contábil, advocacia, salão de beleza, oficina mecânica, etc.). Opcional.
*/
export default CadastroInicial;
