// Register.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { database, auth } from '../../../firebaseConfig';
import { ref, set } from 'firebase/database';
import {MaterialIcons} from "@expo/vector-icons";

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
        if (username === '' ) {
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
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={32} color="black" />
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    input: {
        width: '100%',
        height: 50,
        padding: 10,
        borderWidth: 1,
        borderColor: 'orange',
        marginBottom: 15,
        borderRadius: 5,
    },
    button: {
        width: '100%',
        backgroundColor: 'orange',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        height: 50,
        top: 80,
        left: 10,
    },
});

export default Register;
