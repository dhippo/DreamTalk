import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { database, auth } from '../../../firebaseConfig';
import { ref, set } from 'firebase/database';
import {MaterialIcons} from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const Register = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [emailValid, setEmailValid] = useState(true);

    const validateEmail = (email) => {
        // Expression régulière simple pour la validation de l'e-mail
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleRegister = () => {

        const isEmailValid = validateEmail(email);
        setEmailValid(isEmailValid);
        console.log(emailValid);

        if (!emailValid) {
            console.log(emailValid);
            alert("Veuillez saisir une adresse e-mail valide.");
            return;
        }
        if (password !== confirmPassword) {
            alert("Les mots de passes sont differents!");
            return;
        }
        if (username === '') {
            alert("Veuillez saisir un username unique !");
            return;
        }


        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                if (userCredentials && userCredentials.user) {
                    const user = userCredentials.user;
                    console.log('Registered with:', user.email);

                    const profileRef = ref(database, `users/${user.uid}/profile`);
                    set(profileRef, {
                        username: username.trim(),
                    })
                        .then(() => {
                            // Redirection vers 'Home' après la mise à jour de la base de données
                            navigation.replace('Home');
                        }).catch((dbError) => {
                        console.error("Erreur lors de la mise à jour du profil :", dbError);
                    });
                }

            })
            .catch((error) => {
                alert(error.message);
            });

    };


    return (
        <View style={registerStyles.container}>
            <LinearGradient
                colors={['#f414db', '#2a44ff']}
                style={registerStyles.gradientHeader}
            >
                <TouchableOpacity style={registerStyles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={32} color="#ffffff"/>
                </TouchableOpacity>
                <Text style={registerStyles.headerTitle}>S'INSCRIRE</Text>
            </LinearGradient>

            <View style={registerStyles.inputContainer}>
                <TextInput
                    style={registerStyles.input}
                    placeholder="Nom d'utilisateur"
                    placeholderTextColor="#aaa"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={registerStyles.input}
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={registerStyles.input}
                    placeholder="Mot de passe"
                    placeholderTextColor="#aaa"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TextInput
                    style={registerStyles.input}
                    placeholder="Confirmer le mot de passe"
                    placeholderTextColor="#aaa"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={registerStyles.registerButton} onPress={handleRegister}>
                    <Text style={registerStyles.registerButtonText}>s'inscrire</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const registerStyles = StyleSheet.create({
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
            fontSize: 24,
            fontWeight: '900',
            textAlign: 'center',
            flexGrow: 1,
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
        registerButton: {
            backgroundColor: '#000',
            padding: 15,
            borderRadius: 5,
            alignItems: 'center',
            marginTop: 10,
        },
        registerButtonText: {
            color: "#fff",
            fontWeight: "bold",
            fontSize: 18,
        },
});

export default Register;