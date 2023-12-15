// App.js
import * as React from 'react';
import Home from './src/screens/Home';
import Login from './src/screens/auth/Login';
import Register from './src/screens/auth/Register';
import WelcomeScreen1 from './src/screens/welcome/WelcomeScreen1';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="WelcomeScreen1">
                <Stack.Screen name="Login" component={Login} options={{headerShown:false}} />
                <Stack.Screen name="Home" component={Home} options={{headerShown:false}} />
                <Stack.Screen name="Register" component={Register} options={{headerShown:false}} />
                <Stack.Screen name="WelcomeScreen1" component={WelcomeScreen1} options={{headerShown:false}} />
            </Stack.Navigator>
        </NavigationContainer>
        //todo : ajouter la navbar sur toutes les pages sauf la page de welcomeScreen, de connexion et d'inscription
    );
}
