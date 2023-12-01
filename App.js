// App.js
import * as React from 'react';

import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Vitrine1 from './components/vitrines/Vitrine1';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Vitrine1" component={Vitrine1} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
