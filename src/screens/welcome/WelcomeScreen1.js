import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';

const WelcomeScreen1 = ({ navigation }) => {
    return (
        <ImageBackground
            source={require('../../../assets/fondHeros.jpeg')}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.title}>
                    Bienvenue dans DreamTalk où vous pouvez avoir une discussion de rêve avec ton héros préféré
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.buttonText}>S'inscrire</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.buttonText}>Se connecter</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    title: {
        fontSize: 28,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20, // Border-radius moyen
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: 'orange',
        fontWeight: 'bold',
        fontSize: 24,
        },
});

export default WelcomeScreen1;
