import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, Modal, Pressable, Button, InteractionManager } from "react-native";
import styles from "../../assets/styles/styles";
import Header from "../../assets/components/Header";
import { useNavigation } from "@react-navigation/native";

const Servicos = ({}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Header title="Serviços" />
      <Text style={styles.text} onPress={() => navigation.navigate("ConfigScreen")}>
        Voltar
      </Text>
    </View>
  );
};

export default Servicos;
