import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import {MaterialIcons} from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                console.log('Logged in with:', user.email);
                navigation.navigate('Home');
            })
            .catch((error) => {
                alert(error.message);
            });
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#f414db', '#2a44ff']}
                style={styles.gradientHeader}
            >
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={32} color="#ffffff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SE CONNECTER</Text>
            </LinearGradient>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="email"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="mot de passe"
                    placeholderTextColor="#aaa"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>se connecter</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    gradientHeader: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 40,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 10,
        zIndex: 1,
    },
    headerTitle: {
        color: '#ffffff',
        fontWeight: '900',
        fontSize: 24,
        textAlign: 'center',
    },
    inputContainer: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    input: {
        width: '100%',
        height: 50,
        padding: 10,
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 15,
        borderRadius: 5,
        color: '#000',
    },
    loginButton: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
    },
    forgotPasswordText: {
        textAlign: 'center',
        color: '#2a44ff',
        marginTop: 20,
        fontSize: 16,
    },
    signUpText: {
        textAlign: 'center',
        color: '#f414db',
        marginTop: 20,
        fontSize: 16,
    },
});

export default Login;