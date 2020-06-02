import React, {
  useEffect,
  useReducer,
  createContext,
  useMemo,
  useContext,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Button,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {auth0} from './auth/auth0';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import CompanyLogo from './assets/company_logo.png';
import Home from './screens/Home';
import Directory from './screens/Directory';
import Chatbot from './screens/Chatbot';
import UserProfile from './screens/UserProfile';
import Unknown from './assets/unnamed_user.png';
import LogoutIcon from './assets/logout.png';
import LoginBG from './assets/login_background.jpg';
import Colors from './variables/Colors';

const AuthContext = createContext();

const Stack = createStackNavigator();

const SplashScreen = () => {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
};

const Login = () => {
  const {signIn} = useContext(AuthContext);
  return (
    <View style={styles.screen}>
      <ImageBackground source={LoginBG} style={styles.bg}>
        <View style={styles.logoAndButton}>
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
            <Button title="Login" onPress={signIn} color={Colors.ghostWhite} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const Logout = () => {
  const {signOut} = useContext(AuthContext);
  return (
    <TouchableOpacity onPress={signOut}>
      <Image source={LogoutIcon} style={styles.logoutBtn} />
    </TouchableOpacity>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignOut: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignOut: true,
            userToken: null,
            userProfile: null,
          };
        case 'USER':
          return {
            ...prevState,
            userProfile: action.userProfile,
          };
        default:
          return prevState;
      }
    },
    {
      isLoading: true,
      isSignOut: false,
      userToken: null,
      userProfile: null,
    },
  );

  useEffect(() => {
    const getUserToken = async () => {
      let userToken;
      let profile;
      try {
        userToken = await AsyncStorage.getItem('idToken');
        profile = await AsyncStorage.getItem('profile');
      } catch (err) {
        console.log('Restoring token failed: ', err);
      }
      dispatch({type: 'RESTORE_TOKEN', token: userToken});
      dispatch({type: 'USER', userProfile: JSON.parse(profile)});
    };
    getUserToken();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: (data) => {
        auth0.webAuth
          .authorize({
            scope: 'openid profile email',
            prompt: 'select_account',
          })
          .then((res) => {
            auth0.auth.userInfo({token: res.accessToken}).then(async (user) => {
              console.log('user: ', user);
              try {
                dispatch({type: 'SIGN_IN', token: res.idToken});
                dispatch({type: 'USER', userProfile: user});
                await AsyncStorage.setItem('idToken', res.idToken);
                await AsyncStorage.setItem('profile', JSON.stringify(user));
              } catch (err) {
                console.log('DID NOT SET TOKEN: ', err);
              }
            });
          })
          .catch((err) => {
            console.log('Invalid Credentials: ', err);
          });
      },
      signOut: () => {
        auth0.webAuth
          .clearSession({})
          .then((success) => {
            dispatch({type: 'SIGN_OUT'});
            AsyncStorage.removeItem('idToken');
            AsyncStorage.removeItem('profile');
          })
          .catch((err) => {
            throw err;
          });
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={({navigation, route}) => ({
            // animationEnabled: false,
            headerTitle: '',
            headerRight: () =>
              state.isSignOut === false && route.name === 'Profile' ? (
                <Logout />
              ) : (
                state.isSignOut === false &&
                (route.name === 'Directory' || route.name === 'Home') && (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Profile');
                    }}>
                    <Image
                      source={
                        state.userProfile === null
                          ? Unknown
                          : {uri: state.userProfile.picture}
                      }
                      style={styles.image}
                    />
                  </TouchableOpacity>
                )
              ),
          })}>
          {state.isLoading ? (
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken === null ? (
            <Stack.Screen
              name="SignIn"
              component={Login}
              options={{
                title: 'Sign In',
                // animationTypeForReplace: state.isSignOut ? 'pop' : 'push',
                headerRight: '',
                headerShown: false,
              }}
            />
          ) : (
            <>
              <Stack.Screen
                options={() => ({
                  headerTitle: 'HOME',
                  headerLeft: '',
                })}
                name="Home"
                component={Home}
              />
              <Stack.Screen
                options={() => ({
                  headerTitle: 'DIRECTORY',
                })}
                name="Directory"
                component={Directory}
              />
              <Stack.Screen name="Chatbot">
                {(props) => <Chatbot {...props} profile={state.userProfile} />}
              </Stack.Screen>
              <Stack.Screen name="Profile">
                {(props) => (
                  <UserProfile {...props} profile={state.userProfile} />
                )}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: 'black',
  },
  logoAndButton: {
    backgroundColor: 'black',
    width: '85%',
    height: '40%',
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    flexDirection: 'row',
    marginVertical: 100,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  companyLogo: {
    marginHorizontal: 15,
  },
  title: {
    fontSize: 30,
    color: Colors.ghostWhite,
    fontWeight: 'bold',
  },
  motto: {
    fontSize: 20,
    color: Colors.ghostWhite,
    fontWeight: 'bold',
  },
  mottoWord: {
    fontStyle: 'italic',
    color: Colors.ghostWhite,
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

export default App;
