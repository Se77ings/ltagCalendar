import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, Modal, Pressable, Button, InteractionManager } from "react-native";
import styles from "../styles/styles";
import icon from "../../assets/icon.png"
import { LinearGradient } from 'expo-linear-gradient';

const Header = ({title}) => {
  return (
    <View>
      <LinearGradient
        colors={['#000000', '#0055c6']}
        start={{ x: 0.3, y: 0.2 }}
        style={styles.headerContainer}>

      <View style={styles.logoContainer}>
        <Image source={icon} style={styles.logo} />
        <View >
          <Text style={styles.shopName}>LTAG CALENDAR</Text>
          <Text style={styles.shopName_}>{title}</Text>
          {/* <Text style={styles.shopName_}>SEJA BEM-VINDO!!</Text> */}
        </View>
      </View>
      </LinearGradient>
    </View>
  );
};

export default Header;
