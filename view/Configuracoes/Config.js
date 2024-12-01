import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import styles from "../../assets/styles/styles";
import Header from "../../assets/components/Header";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colaboradores from "./Colaboradores";
import Servicos from "./Servicos";
import Estabelecimento from "./Estabelecimento";
import { TourGuideProvider, TourGuideZone } from "rn-tourguide";
import AppConfig from "./Appconfig";
import DetalhesAtendimento from "./GerenciarMensagem";

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
          <TourGuideZone zone={4} text="Aqui você consegue alterar as informações básicas da sua empresa, e inserir uma logo para personalizar sua experiência!" style={{ justifyContent: "center", width: "50%" }}>
            <Card title={"Sua Empresa"} icon={"business"} screen="Estabelecimento" />
          </TourGuideZone>
          <TourGuideZone zone={5} text="Nessa área você cadastrará os Serviços prestados pelo seu estabelecimento" style={{ justifyContent: "center", width: "50%", borderRadius:10 }}>
            <Card title={"Serviços"} icon={"construct-outline"} screen="Servicos" />
          </TourGuideZone>
          <TourGuideZone zone={6} text="Aqui você cadastrará os Colaboradores que trabalham no seu estabelecimento, e pode vinculá-los a algum serviço anteriormente cadastrado" style={{ justifyContent: "center", width: "50%", borderRadius:10 }}>
            <Card title={"Colaboradores"} icon={"people-outline"} screen="Colaboradores" />
          </TourGuideZone>
          <TourGuideZone zone={7} text="Nessa área, você conseguirá alterar o tema do aplicativo, e também fazer alterações na base de dados do aplicativo" style={{ justifyContent: "center", width: "50%", borderRadius:10}}>
              <Card title={"Aplicativo"} icon={"phone-portrait-outline"} screen={"AppConfig"}/>
          </TourGuideZone>
          <TourGuideZone zone={5} text="Teste" style={{ justifyContent: "center", width: "50%", borderRadius:10 }}>
            <Card title={"Mensagem"} icon={"construct-outline"} screen="GerenciarMensagem" />
          </TourGuideZone>
        </View>
      </View>
    </>
  );
};

const Config = () => {
  return (
    <Stack.Navigator initialRouteName="ConfigScreen" >
      <Stack.Screen name="ConfigScreen"  component={ConfigScreen} options={{ headerShown: false, headerTitle: "Configurações" }} />
      <Stack.Screen name="Colaboradores" component={Colaboradores} options={{ headerShown: true, headerTitle: "Colaboradores", headerTitleAlign: "center" }} />
      <Stack.Screen name="Servicos" component={Servicos} options={{ headerShown: true, headerTitle: "Serviços", headerTitleAlign: "center" }} />
      <Stack.Screen name="Estabelecimento" component={Estabelecimento} options={{ headerShown: true, headerTitle: "Estabelecimento", headerTitleAlign: "center" }} />
      <Stack.Screen name="AppConfig"  component={AppConfig} options={{ headerShown: true, headerTitle: "Configurações do Aplicativo", headerTitleAlign: "center"}}   />
      <Stack.Screen 
        name="GerenciarMensagem" 
        component={DetalhesAtendimento} 
        options={{ headerShown: true, headerTitle: "Gerenciar Mensagem", headerTitleAlign: "center" }} 
      />
    </Stack.Navigator>
  );
};

export default Config;
