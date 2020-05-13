import React from 'react';
import Home from '../screens/Home';
import Directory from '../screens/Directory';
import Chatbot from '../screens/Chatbot';
import Colors from '../variables/Colors';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Navigation = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        headerMode="float"
        screenOptions={{
          headerStyle: {backgroundColor: Colors.ghostWhite},
          headerTitleStyle: {
            display: 'none',
          },
        }}>
        <Stack.Screen name="Rediminds" component={Home} />
        <Stack.Screen name="Directory" component={Directory} />
        <Stack.Screen name="Chatbot" component={Chatbot} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
