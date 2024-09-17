import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, Modal, Pressable, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function NovoAgendamento() {
  // Dados obrigatórios: nome do cliente, telefone, data e horário, serviço a ser realizado;
  // sugestão: https://formik.org/docs/guides/react-native
  return (

    <View style={{ backgroundColor: "white", alignSelf: "center", width: "90%", padding: 30, borderRadius: 20 }}>
      <Text>Nome do Cliente:</Text>
      <TextInput style={{ borderWidth: 1, borderColor: "black", borderRadius: 5, padding: 5 }} />
      <Text>Telefone:</Text>
      <TextInput style={{ borderWidth: 1, borderColor: "black", borderRadius: 5, padding: 5 }} />
      <Text>Data:</Text>
      <TextInput style={{ borderWidth: 1, borderColor: "black", borderRadius: 5, padding: 5 }} />
      <Text>Hora:</Text>
      <TextInput style={{ borderWidth: 1, borderColor: "black", borderRadius: 5, padding: 5 }} />
      <Text>Serviço:</Text>
      <TextInput style={{ borderWidth: 1, borderColor: "black", borderRadius: 5, padding: 5 }} />
      <View style={{ marginTop: 10, flexDirection:"row", justifyContent:"space-between" }}>
        <Button title="Limpar Campos"></Button>
        <Button title="Cadastrar Serviço" />
      </View>
    </View>
  );
}
