import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import styles from "../../assets/styles/styles";
import Header from "../../assets/components/Header";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colaboradores from "./Colaboradores";
import Servicos from "./Servicos";
import { TourGuideProvider, TourGuideZone } from "rn-tourguide";

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
      <View style={styles.container}>
        <Header title={"Configurações"} />
        <View style={{ flex: 1, alignItems: "center", height: "100%", justifyContent: "center" }}>
          <TourGuideZone zone={4} text="Essa é a zona 5" style={{justifyContent:"center", width:"50%" }}>
            <Card title={"Serviços"} icon={"construct-outline"} screen="Servicos" />
            <Card title={"Colaboradores"} icon={"people-outline"} screen="Colaboradores" />
          </TourGuideZone>
        </View>
      </View>
    </>
  );
};

const Config = () => {
  return (
    <Stack.Navigator initialRouteName="ConfigScreen">
      <Stack.Screen name="ConfigScreen" component={ConfigScreen} options={{ headerShown: false, headerTitle: "Configurações" }} />
      <Stack.Screen name="Colaboradores" component={Colaboradores} options={{ headerShown: true, headerTitle: "Colaboradores", headerTitleAlign: "center" }} />
      <Stack.Screen name="Servicos" component={Servicos} options={{ headerShown: true, headerTitle: "Serviços", headerTitleAlign: "center" }} />
    </Stack.Navigator>
  );
};

export default Config;
