import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createStackNavigator } from "@react-navigation/stack";
import styles from "../../assets/styles/styles";
import Header from "../../assets/components/Header";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colaboradores from "./Colaboradores";
import Servicos from "./Servicos";
import { StatusBar } from "expo-status-bar";

const Stack = createStackNavigator();

const ConfigScreen = ({ navigation }) => {
  const Card = ({ title, icon, screen }) => {
    return (
      <TouchableOpacity style={styles.cardStyle} onPress={() => navigation.navigate(screen)}>
        <Text style={{ color: "white", fontSize: 18 }}>{title}</Text>
        <Ionicons name={icon} size={30} color={"#fff"} />
      </TouchableOpacity>
    );
  };

  return (
    <>
    <StatusBar style="inverted" backgroundColor={"black"}/>
    <SafeAreaView>
      <View style={styles.container}>
        <Header title={"Configurações"} />
        <View style={{ flex: 1, alignItems: "center", height: "100%", justifyContent: "center" }}>
          <Card title={"Serviços"} icon={"construct-outline"} screen="Servicos" />
          <Card title={"Colaboradores"} icon={"people-outline"} screen="Colaboradores" />
        </View>
      </View>
    </SafeAreaView>
    </>
  );
};

const Config = () => {
  return (
    <Stack.Navigator initialRouteName="ConfigScreen">
      <Stack.Screen name="ConfigScreen" component={ConfigScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Colaboradores" component={Colaboradores} options={{ headerShown: true, headerTitle: "Colaboradores", headerTitleAlign: "center" }} />
      <Stack.Screen name="Servicos" component={Servicos} options={{ headerShown: true, headerTitle: "Serviços", headerTitleAlign: "center" }} />
    </Stack.Navigator>
  );
};

export default Config;
