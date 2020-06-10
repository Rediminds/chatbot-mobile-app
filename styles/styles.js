import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    flexDirection: 'row',
    marginVertical: 20,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  companyLogo: {
    marginHorizontal: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  motto: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  mottoWord: {
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  loginBtn: {
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logout: {
    top: 10,
    left: 10,
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15,
  },
  logoutBtn: {
    width: 20,
    height: 20,
    marginRight: 15,
  },
});
