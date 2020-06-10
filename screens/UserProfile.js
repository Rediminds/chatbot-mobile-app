import React, {useLayoutEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import Colors from '../variables/Colors';

const UserProfile = ({profile, navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity>
          <Button
            title="Directory"
            onPress={() => navigation.navigate('Directory')}
          />
        </TouchableOpacity>
      ),
    });
  });
  const {email, name, picture} = profile;
  return (
    <View style={styles.screen}>
      <View>
        <Image source={{uri: picture ? picture : ''}} style={styles.image} />
      </View>
      <Text style={styles.name}>{name ? name : ''}</Text>
      <Text style={styles.email}>{email ? email : ''}</Text>
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
  image: {
    width: 250,
    height: 250,
    borderRadius: 175,
  },
  name: {
    fontSize: 30,
    marginTop: 20,
  },
  email: {
    fontSize: 20,
    marginVertical: 20,
  },
});

export default UserProfile;
