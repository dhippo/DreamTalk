import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

function Home({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Accueil</Text>
            <Text style={styles.text}>Bienvenue sur DreamTalk</Text>
            <Button
                title="Go to Page 2"
                onPress={() => navigation.navigate('Page2')}
            />
            <Button
                title="Go to Login"
                onPress={() => navigation.navigate('Login')}
            />
            <Button
                title="Go to Register"
                onPress={() => navigation.navigate('Register')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 28,
        marginBottom: 10
    }
});

export default Home;
