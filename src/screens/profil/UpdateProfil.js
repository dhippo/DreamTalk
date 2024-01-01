// /Users/macbook/bachelor3/app-hybride/DreamTalk/src/screens/profil/UpdateProfil.js
import React, { useState } from 'react';
import { View, Image, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { database } from '../../../firebaseConfig';
import { ref, set } from 'firebase/database';
import { auth } from '../../../firebaseConfig';
import {MaterialIcons} from "@expo/vector-icons";

const UpdateProfil = ({ route, navigation }) => {
    const { userProfile } = route.params;
    const [name, setName] = useState(userProfile.name);
    const [firstname, setFirstname] = useState(userProfile.firstname);

    const handleSaveChanges = () => {
        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            // Chemin pour les données de profil
            const profileRef = ref(database, `users/${userId}/profile`);

            set(profileRef, {
                name,
                firstname
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
            <View style={}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nom Complet" />
            <TextInput style={styles.input} value={firstname} onChangeText={setFirstname} placeholder="Prénom" />
            <TextInput style={styles.input} value={firstname} onChangeText={setFirstname} placeholder="Prénom" />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.saveButtonText}>ENREGISTER</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5', // Couleur de fond similaire à InfoProfil
    },
    profilePic: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        padding: 15,
        borderRadius: 5,
        marginBottom: 15,
        width: '80%',
        fontSize: 18,
        backgroundColor: '#FFFFFF', // Fond blanc
    },
    saveButton: {
        backgroundColor: '#0C0DFF', // Style de bouton similaire
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        width: '80%',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default UpdateProfil;