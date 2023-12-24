import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { database, auth } from '../../../firebaseConfig';
import { ref, set } from 'firebase/database';
import {MaterialIcons} from "@expo/vector-icons";

const UpdateProfil = ({ route, navigation }) => {
    const { userProfile } = route.params;
    const [name, setName] = useState(userProfile.name);
    const [username, setUsername] = useState(userProfile.username);
    const [firstname, setFirstname] = useState(userProfile.firstname);

    const handleSaveChanges = () => {
        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            // Chemin pour les données de profil
            const profileRef = ref(database, `users/${userId}/profile`);

            if (username === '' ) {
                alert("Veuillez saisir un username !");
                return;
            }

            set(profileRef, {
                username: username.trim(),
                name: name.trim(),
                firstname: firstname.trim()
            })
                .then(() => {
                    Alert.alert("Profil mis à jour", "Les informations ont été enregistrées.", [
                        { text: "OK", onPress: () => navigation.goBack() }
                    ]);
                })
                .catch((error) => {
                    Alert.alert("Erreur", error.message);
                });
        } else {
            Alert.alert("Erreur", "Aucun utilisateur connecté");
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={32} color="black" />
            </TouchableOpacity>
            <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Username" />
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nom" />
            <TextInput style={styles.input} value={firstname} onChangeText={setFirstname} placeholder="Prénom" />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
        backgroundColor: 'white',
    },
    input: {
        borderWidth: 1,
        borderColor: 'orange',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: 'orange',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default UpdateProfil;
