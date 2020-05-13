import React, {useState} from 'react';
import {Alert, Button, StyleSheet, View} from 'react-native';
import Navigation from './navigation/Navigation';
import {auth0, AUTH0_DOMAIN} from './auth/auth0';
import Login from './screens/Login';

const App = () => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const loginScreen = () => {
    auth0.webAuth
      .authorize({scope: 'openid profile email'})
      .then((credentials) => {
        console.log('credentials:: ', credentials);
        setToken(credentials.accessToken);
        setIsLoading(false);
      })
      .catch((err) => {
        throw err;
      });
  };
  const logout = () => {
    console.log('logout');

    auth0.webAuth
      .clearSession({})
      .then((success) => {
        setToken(null);
        setIsLoading(false);
        // Alert.alert('You have logged out');
      })
      .catch((err) => {
        throw err;
      });
  };
  return (
    <View style={styles.container}>
      {token !== null ? (
        <Navigation logout={logout} />
      ) : (
        // <View style={styles.button}>
        //   <Button title="Login" onPress={() => loginScreen()} />
        // </View>
        <Login login={loginScreen} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logout: {
    // position: 'absolute',
    top: 10,
    left: 10,
  },
});

export default App;
