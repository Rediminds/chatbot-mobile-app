import React from "react";
import { View, Button, Text, StyleSheet, Image } from "react-native";
import ChatbotLogo from "../assets/chatbot_logo.png";
import Colors from "../variables/Colors";

const Home = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <View>
        <Image style={styles.chatbotLogo} source={ChatbotLogo} />
      </View>
      <Text style={styles.title}>Rediminds Chatbot Applications</Text>
      <View style={styles.button}>
        <Button
          title="Begin"
          onPress={() => navigation.navigate("Directory")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.ghostWhite,
  },
  chatbotLogo: {
    width: 75,
    height: 75,
  },
  title: {
    fontSize: 22,
    marginVertical: 10,
  },
  button: {
    marginVertical: 10,
    width: "30%",
  },
});

export default Home;
