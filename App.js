import React, {useEffect, useReducer, createContext, useMemo} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {auth0} from './auth/auth0';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './screens/Home';
import Directory from './screens/Directory';
import Chatbot from './screens/Chatbot';
import UserProfile from './screens/UserProfile';
import Unknown from './assets/unnamed_user.png';
import Splash from './screens/Splash';
import {styles} from './styles/styles';
import Login from './screens/Login';
import Logout from './components/Logout';

import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';

export const AuthContext = createContext();

const Stack = createStackNavigator();

const App = () => {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      const {type, payload} = action;
      switch (type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            token: payload,
            loading: false,
          };
        case 'SIGN_IN':
          RNSecureKeyStore.set('token', payload, {
            accessessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
          });
          return {
            ...prevState,
            isSignOut: false,
            token: payload,
            loading: false,
          };
        case 'SIGN_OUT':
          RNSecureKeyStore.remove('token').then(
            (res) => {
              console.log('RES: ', res);
            },
            (err) => {
              console.log('ERROR: ', err);
            },
          );
          return {
            ...prevState,
            isSignOut: true,
            token: null,
            user: null,
            loading: false,
          };
        case 'USER':
          RNSecureKeyStore.set('profile', JSON.stringify(payload), {
            accessessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
          });
          return {
            ...prevState,
            user: payload,
            loading: false,
          };
        default:
          return prevState;
      }
    },
    {
      loading: true,
      isSignOut: false,
      token: null,
      user: null,
    },
  );

  useEffect(() => {
    const getUserToken = async () => {
      try {
        await RNSecureKeyStore.get('token').then(
          (token) => {
            console.log('TOKEN: ', token);
            dispatch({type: 'RESTORE_TOKEN', payload: token});
          },
          (err) => {
            console.log('TOKEN ERRRR', err);
          },
        );

        await RNSecureKeyStore.get('profile').then(
          (user) => {
            console.log('user: ', user);
            dispatch({type: 'USER', payload: JSON.parse(user)});
          },
          (err) => {
            console.log('ERRR: ', err);
          },
        );
      } catch (err) {
        console.log('Restoring token failed: ', err);
      }
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
                dispatch({type: 'SIGN_IN', payload: res.idToken});
                dispatch({type: 'USER', payload: user});
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
          })
          .catch((err) => {
            throw err;
          });
      },
    }),
    [],
  );

  const {loading, token, user, isSignOut} = state;

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={({navigation: {navigate}, route: {name}}) => ({
            // animationEnabled: false,
            headerTitle: '',
            headerRight: () =>
              isSignOut === false && name === 'Profile' ? (
                <Logout />
              ) : (
                isSignOut === false &&
                (name === 'Directory' || name === 'Home') && (
                  <TouchableOpacity
                    onPress={() => {
                      navigate('Profile');
                    }}>
                    <Image
                      source={user === null ? Unknown : {uri: user.picture}}
                      style={styles.image}
                    />
                  </TouchableOpacity>
                )
              ),
          })}>
          {loading ? (
            <Stack.Screen name="Splash" component={Splash} />
          ) : token === null ? (
            <Stack.Screen
              name="SignIn"
              component={Login}
              options={{headerShown: false}}
            />
          ) : (
            <>
              <Stack.Screen
                name="Home"
                component={Home}
                options={{headerTitle: 'HOME'}}
              />
              <Stack.Screen
                name="Directory"
                component={Directory}
                options={{headerTitle: 'DIRECTORY'}}
              />
              <Stack.Screen name="Chatbot">
                {(props) => <Chatbot {...props} profile={user} />}
              </Stack.Screen>
              <Stack.Screen name="Profile">
                {(props) => <UserProfile {...props} profile={user} />}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};
export default App;
