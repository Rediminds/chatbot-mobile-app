import React from "react";
import { View, StyleSheet, Image } from "react-native";
import CompanyLogo from "../assets/company_logo.png";
import Colors from "../variables/Colors";

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <View>
        <Image style={styles.image} source={CompanyLogo} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.ghostWhite,
  },
  image: {
    marginTop: 30,
    width: 50,
    height: 50,
  },
});

export default Header;
