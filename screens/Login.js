import React, {useContext} from 'react';
import {AuthContext} from '../App';
import {styles} from '../styles/styles';
import {View, Text, Button, Image} from 'react-native';
import CompanyLogo from '../assets/company_logo.png';

const Login = () => {
  const {signIn} = useContext(AuthContext);
  return (
    <View style={styles.screen}>
      <View>
        <View style={styles.logoWrapper}>
          <View style={styles.companyLogo}>
            <Image source={CompanyLogo} />
          </View>
          <View>
            <Text style={styles.title}>RediMinds, Inc</Text>
            <Text style={styles.motto}>
              Data is <Text style={styles.mottoWord}>Power</Text>
            </Text>
          </View>
        </View>
        <View style={styles.loginBtn}>
          <Button title="Login" onPress={signIn} />
        </View>
      </View>
    </View>
  );
};

export default Login;
