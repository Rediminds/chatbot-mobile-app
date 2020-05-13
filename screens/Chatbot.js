import React from 'react';
import {View, StyleSheet} from 'react-native';
import Colors from '../variables/Colors';
import ChatDialog from '../components/ChatDialog';

const Chatbot = ({route}) => {
  const {API, avatar, title} = route.params;

  return (
    <View style={styles.screen}>
      <ChatDialog avatar={avatar} API={API} title={title} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.ghostWhite,
  },
});

export default Chatbot;
