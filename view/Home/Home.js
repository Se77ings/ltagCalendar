import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, Modal, Pressable } from "react-native";
import NovoAgendamento from "./NovoAgendamento";
import { NavigationContainer, useNavigation } from "@react-navigation/native";

import { createStackNavigator } from "@react-navigation/stack";

export default function Home() {
  const Stack = createStackNavigator();
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  function Main() {
    return (
      <View style={styles.container}>
        <Button
          title="Novo Agendamento"
          onPress={() => {
            setVisible(true);
              // navigation.navigate("NovoAgendamento");
          }}
        />
        <Modal visible={visible} transparent={true}>
          <Pressable
            onPress={() => {
              setVisible(false);
            }}
            style={{ height: "100%", backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center" }}>
            <NovoAgendamento />
          </Pressable>
        </Modal>
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen name="Main" component={Main} options={{headerShown:false}} />
      <Stack.Screen name="NovoAgendamento" component={NovoAgendamento} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo o espaço da tela
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
