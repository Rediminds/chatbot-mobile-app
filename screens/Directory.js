import React, {useLayoutEffect} from 'react';
import {View, StyleSheet, Button} from 'react-native';
import prostateAvatar from '../assets/prostate_avatar.png';
import covidAvatar from '../assets/covid_avatar.png';
import jokesAvatar from '../assets/jokes_avatar.png';

import Colors from '../variables/Colors';

export const Directory = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button title="Home" onPress={() => navigation.navigate('Home')} />
      ),
    });
  });
  return (
    <View style={styles.screen}>
      <View style={styles.buttons}>
        <Button
          title="Prostate Chatbot"
          onPress={() =>
            navigation.navigate('Chatbot', {
              API: 'https://prostatebot.rediminds.com/api',
              avatar: prostateAvatar,
              title: 'prostate',
            })
          }
        />
      </View>
      <View style={styles.buttons}>
        <Button
          title="Covid Chatbot"
          onPress={() =>
            navigation.navigate('Chatbot', {
              API: 'https://bot.rediminds.com/api',
              avatar: covidAvatar,
              title: 'covid',
            })
          }
        />
      </View>
      <View style={styles.buttons}>
        <Button
          title="Jokes Chatbot"
          onPress={() =>
            navigation.navigate('Chatbot', {
              API: 'https://jokesbot.rediminds.com/api',
              avatar: jokesAvatar,
              title: 'jokes',
            })
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.ghostWhite,
  },
  buttons: {
    marginVertical: 10,
    width: '40%',
  },
});

export default Directory;
