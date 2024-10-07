import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, Modal, Pressable, Button, InteractionManager } from "react-native";
import styles from "../styles/styles";

const Header = ({title}) => {
  return (
    <View style={[styles.headerContainer]}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: "https://img.freepik.com/psd-gratuitas/logotipo-abstrato-gradiente_23-2150689648.jpg" }} style={styles.logo} />
        <View >
          <Text style={styles.shopName}>LTAG CALENDAR</Text>
          <Text style={styles.shopName_}>{title}</Text>
          {/* <Text style={styles.shopName_}>SEJA BEM-VINDO!!</Text> */}
        </View>
      </View>
    </View>
  );
};

export default Header;
