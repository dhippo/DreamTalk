import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UpdateProfil from "./UpdateProfil";
import InfoProfil from "./InfoProfil";
import Settings from "./Settings";


const Stack = createNativeStackNavigator();

const ProfileStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="InfoProfil" component={InfoProfil} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="UpdateProfil" component={UpdateProfil} />
        </Stack.Navigator>
    );
};

export default ProfileStack;

