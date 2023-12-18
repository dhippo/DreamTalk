// DreamTalk/src/screens/contact/EditContact.js
import React, { useState } from 'react';
import {View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity} from 'react-native';
import { database } from '../../../firebaseConfig';
import { ref, set } from 'firebase/database';
import { auth } from '../../../firebaseConfig';
import {MaterialIcons} from "@expo/vector-icons";
const EditContact = ({ route, navigation }) => {
    const { contact } = route.params;
    const [name, setName] = useState(contact.name);
    const [firstname, setFirstname] = useState(contact.firstname);
    const [email, setEmail] = useState(contact.email);

    const handleSaveChanges = () => {
        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            // Utilisation de l'ID du contact pour la mise à jour
            const contactRef = ref(database, `users/${userId}/contacts/${contact.id}`);

            set(contactRef, {
                name,
                firstname,
                email
            })
                .then(() => {
                    Alert.alert("Modifications enregistrées", "Les informations du contact ont été mises à jour.", [
                        { text: "OK", onPress: () => navigation.navigate('ContactsList') }
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
            <Text style={styles.header}>Modifier un contact</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nom"
                placeholderTextColor="gray"
            />
            <TextInput
                style={styles.input}
                value={firstname}
                onChangeText={setFirstname}
                placeholder="Prénom"
                placeholderTextColor="gray"
            />
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="gray"
                keyboardType="email-address"
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.saveButtonText}>Sauvegarder les modifications</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,

        backgroundColor: 'white', // Fond blanc pour l'écran
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    input: {
        borderWidth: 1,
        borderColor: 'orange', // Bordure orange pour les champs de saisie
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: 'orange', // Bouton de sauvegarde orange
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: 'white', // Texte du bouton en blanc
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        marginBottom: 30,
        marginLeft: -20,
    }
});

export default EditContact;
