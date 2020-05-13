import React from 'react';
import {Button, Image, View, StyleSheet} from 'react-native';
import CompanyLogo from '../assets/company_logo.png';

const Login = ({login}) => {
  return (
    <View style={styles.screen}>
      <View>
        <Image source={CompanyLogo} />
      </View>
      <View style={styles.button}>
        <Button title="Login" onPress={() => login()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginVertical: 30,
    width: '25%',
  },
});

export default Login;
