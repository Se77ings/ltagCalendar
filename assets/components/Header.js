import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, Modal, Pressable, Button, InteractionManager } from "react-native";
import styles from "../styles/styles";
import icon from "../../assets/icon.png";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

const Header = ({ title }) => {
  return (
    <View>
      <LinearGradient colors={["#000000", "#0055c6"]} start={{ x: 0.3, y: 0.2 }} style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Image source={icon} style={styles.logo} />
          <View style={{flex:1,flexDirection:"row", justifyContent:"space-around"}}>
            <View>
              <Text style={styles.shopName}>LTAG CALENDAR</Text>
              <Text style={styles.shopName_}>{title}</Text>
            </View>
            {/* <Text style={styles.shopName_}>SEJA BEM-VINDO!!</Text> */}
            <View style={{marginLeft:25}}>

            <Ionicons name="contrast-outline" size={25} color="white" />
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default Header;
