// App.js
import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function Page1({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Page 1</Text>
            <Button
                title="Go to Page 2"
                onPress={() => navigation.navigate('Page2')}
            />
        </View>
    );
}

function Page2({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Page 2</Text>
            <Button
                title="Go to Page 1"
                onPress={() => navigation.navigate('Page1')}
            />
        </View>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Page1" component={Page1} />
                <Stack.Screen name="Page2" component={Page2} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
