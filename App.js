import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, Modal, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import NovoAgendamento from "./view/NovoAgendamento";

export default function App() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <Button
          title="Novo Agendamento"
          onPress={() => {
            setVisible(true);
          }}
        />
      </View>
      <Modal visible={visible} transparent={true}>
        <Pressable
          onPress={() => {
            setVisible(false);
          }}
          style={{ height: "100%", backgroundColor: "rgba(0,0,0,0.5)", justifyContent:"center"}}>
          <NovoAgendamento />
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
