// App.js
import * as React from 'react';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import WelcomeScreen1 from './pages/welcome/WelcomeScreen1';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="WelcomeScreen1">
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="WelcomeScreen1" component={WelcomeScreen1} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
