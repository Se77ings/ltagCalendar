import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, Modal, Pressable, Button, InteractionManager } from "react-native";
import styles from "../styles/styles";
import icon from "../../assets/icon.png"
const Header = ({title}) => {
  return (
    <View style={[styles.headerContainer]}>
      <View style={styles.logoContainer}>
        <Image source={icon} style={styles.logo} />
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
