// Register.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const Register = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = () => {
        // Ici, ajoutez votre logique pour l'inscription
        // Par exemple, vérifiez si les mots de passe correspondent et envoyez les données à un serveur
        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        console.log(email, password, confirmPassword);
        // Vous pouvez naviguer vers un autre écran après l'inscription
        // Par exemple: navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
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
            <Button title="Register" onPress={handleRegister} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: 200,
        height: 40,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 10,
    },
});

export default Register;
