import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, Modal, Pressable, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import Home from "./view/Home/Home";


export default function App() {
  const Tab = createBottomTabNavigator();
  return (
      <NavigationContainer>
        <StatusBar style="light" />
        <Tab.Navigator initialRouteName="Home" screenOptions={{ tabBarStyle: { backgroundColor: "#14213d" } }}>
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
              tabBarLabel: "Início",
              tabBarLabelStyle: { fontSize: 12, color: "white" },
              tabBarIcon: () => (
                <View style={styles.iconDiv}>
                  <Ionicons name="home-outline" color={"white"} size={22} />
                </View>
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({

  iconDiv: {
    borderWidth: 1.5,
    borderColor: "white",
    borderRadius: 50,
    padding: 5,
    height: 36,
    marginTop: 5,
    alignSelf: "center",
  },
});
