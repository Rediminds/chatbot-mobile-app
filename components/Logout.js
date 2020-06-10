import React, {useContext} from 'react';
import {TouchableOpacity} from 'react-native';
import {Image} from 'react-native';
import {styles} from '../styles/styles';
import LogoutIcon from '../assets/logout.png';
import {AuthContext} from '../App';

const Logout = () => {
  const {signOut} = useContext(AuthContext);
  return (
    <TouchableOpacity onPress={signOut}>
      <Image source={LogoutIcon} style={styles.logoutBtn} />
    </TouchableOpacity>
  );
};

export default Logout;
