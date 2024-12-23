import React, { useState } from "react";
import { View, Text, TouchableOpacity, Button, StyleSheet, Alert, DeviceEventEmitter } from "react-native";
import { FloatingLabelInput } from "react-native-floating-label-input";
import DropdownSelector from "../../assets/components/DropdownSelector";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { ramosDeAtividade } from "../../services/ramoService";
import adicionarEstabelecimentoAsync from "../../services/estabelecimentoService";
import adicionarServico from "../../services/servicoService";
import { formatPhoneNumber } from "../../assets/global/functions";
import Toast from "react-native-root-toast";
import { useTheme } from "../../ThemeContext"; // Usando o hook useTheme para acessar o estado do tema

const CadastroInicial = ({ navigation, setPrimeiraInicializacao }) => {
  let tema = useTheme();
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    logo: "",
    theme: tema.theme,
  });
  const [erro, setErro] = useState({
    nome: false,
    telefone: false,
  });
  const [image, setImage] = useState(null);

  const handleChange = (name, value) => {
    if (name === "telefone") {
      value = formatPhoneNumber(value);
      setFormData({ ...formData, [name]: value });
    }

    if (name === "ramoAtividade") {
      const ramos = [];
      const servicos = [];

      value.forEach((item) => {
        if (item.startsWith("list_")) {
          const ramoId = item.split("_")[1]; // Pega o ID do ramo
          ramos.push({ id: ramoId, nome: ramosDeAtividade.find((r) => r.id == ramoId)?.nome });
        } else if (item.startsWith("servico_")) {
          const [_, ramoId, servicoIndex] = item.split("_"); // Pega o ID do ramo e o índice do serviço
          const ramo = ramosDeAtividade.find((r) => r.id == ramoId);
          if (ramo) {
            const servico = ramo.servicos[servicoIndex];
            servicos.push({ ...servico, ramoId: ramoId }); // Inclui o `ramoId` como referência
          }
        }
      });

      setFormData({ ...formData, ramos, servicos });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSendData = async () => {
    if (formData.nome === "" || formData.telefone === "") {
      setErro({ nome: "Nome é obrigatório", telefone: "Telefone é obrigatório" });
      setTimeout(() => {
        setErro({ nome: false, telefone: false });
      }, 3000);
      return;
    }

    if (formData.telefone.length < 14 || formData.telefone.length > 15) {
      setErro({ ...erro, telefone: "Telefone Inválido" });

      setTimeout(() => {
        setErro({ ...erro, telefone: false });
      }, 3000);

      adicionarEstabelecimentoAsync(formData);
    }

    if (image) {
      formData.logo = image;
    }

    let formSend = {
      nome: formData.nome,
      telefone: formData.telefone.replace(/\D/g, ""),
      endereco: formData.endereco,
      logo: formData.logo,
      theme: tema.theme
    };

    formData.servicos.forEach((servico) => {
      adicionarServico(servico);
    });
    const result = await adicionarEstabelecimentoAsync(formSend);
    DeviceEventEmitter.emit("atualizarEstabelecimento");
    console.log("Dados Iniciais Cadastrados.");
    if (result.success) {
      Toast.show("Dados cadastrados com sucesso", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: false,
      });
      setPrimeiraInicializacao(false);
    } else {
      Alert.alert("Erro", result.error);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(JSON.stringify(result.assets[0]));
    }
  };

  const { theme, toggleTheme } = useTheme();
  const textColor = theme === "dark" ? "white" : "black";
  const textColor2 = theme === "dark" ? "white" : "white";

  const fundoInput = theme === "dark" ? "#020C2A" : "white";
  const ColorInput = theme === "dark" ? "#666699" : "black";
  const buttons = theme === "dark" ? "#020C2A" : "#666699";
  const fundoTheme = theme === "dark" ? "#001a66" : "#2F407A";

  return (
    <View style={[styles.formContainer, { backgroundColor: fundoTheme }]}>
      <Text style={[styles.formTitle, { color: textColor2 }]}>Dados Iniciais</Text>
      <Text style={{ textAlign: "center", color: textColor2 }}>Agora, você precisa informar alguns dados iniciais</Text>
      <FloatingLabelInput
        // labelStyles={[styles.labelStyle, {color:"red"}]}
        labelStyles={styles.labelStyle}
        containerStyles={[styles.input, { backgroundColor: fundoInput }]}
        label="Nome do Estabelecimento"
        inputStyles={theme == "dark" ? { color: "white" } : { color: "black" }}
        value={formData.nome}
        onChangeText={(value) => handleChange("nome", value)}
      />
      {erro.nome && <Text style={{ color: "red", paddingLeft: 15 }}>{erro.nome}</Text>}
      <FloatingLabelInput
        keyboardType="numeric"
        hint="(17) 9999-9999"
        inputStyles={theme == "dark" ? { color: "white" } : { color: "black" }}
        labelStyles={styles.labelStyle}
        containerStyles={[styles.input, { backgroundColor: fundoInput }]}
        label="Telefone"
        value={formData.telefone}
        onChangeText={(value) => handleChange("telefone", value)}
      />
      {erro.telefone && <Text style={{ color: "red", paddingLeft: 15 }}>{erro.telefone}</Text>}
      <FloatingLabelInput
        labelStyles={styles.labelStyle}
        containerStyles={[styles.input, { backgroundColor: fundoInput }]}
        label="Endereço"
        hint="Opcional"
        inputStyles={theme == "dark" ? { color: "white" } : { color: "black" }}
        value={formData.endereco}
        onChangeText={(value) => handleChange("endereco", value)}
      />
      <TouchableOpacity onPress={pickImage} style={{ flexDirection: "row", justifyContent: "space-between", padding: 10, paddingHorizontal: 20, borderWidth: 1, borderColor: theme == "dark" ? "white" : "black", borderStyle: "dashed", borderRadius: 10, backgroundColor: image ? "#20bf55" : null }}>
        <View style={{ flexDirection: "column" }}>
          <Text style={{ alignSelf: "center", color: image ? textColor : textColor2, fontSize: 16 }}>Logotipo do seu estabelecimento</Text>
          <Text style={{ fontSize: 12, color: image ? textColor : "gray" }}>{image ? "Imagem Selecionada!" : "Clique aqui para enviar uma imagem"}</Text>
        </View>
        <Ionicons name={image ? "checkbox-outline" : "camera"} size={30} color={image ? "white" : "white"} />
      </TouchableOpacity>
      <DropdownSelector lista={ramosDeAtividade} label="Ramo(s) e Serviço(s)" icone="business" callbackSelecionados={(value) => handleChange("ramoAtividade", value)} opt={"ramo"} />
      <Text style={{ margin: 0, fontSize: 12, position: "relative", top: -10, left: 10, color: textColor2 }}>Opcional</Text>
      <TouchableOpacity style={[styles.submitButton, { backgroundColor: buttons }]} onPress={handleSendData}>
        <Text style={styles.submitButtonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
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
    marginBottom: 20,
  },
  input: {
    color: "white",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    height: 50,
    justifyContent: "center",
  },
  labelStyle: {
    color: "white",
    paddingHorizontal: 5,
    marginTop: 5,
  },
  submitButton: {
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

export default CadastroInicial;
