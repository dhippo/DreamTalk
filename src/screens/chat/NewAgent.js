// src/screens/chat/NewAgent.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { database } from '../../../firebaseConfig';
import { ref, set } from 'firebase/database';
import { auth } from '../../../firebaseConfig';
import { MaterialIcons } from "@expo/vector-icons";

const NewAgent = ({ navigation }) => {
    const [heroName, setHeroName] = useState('');

    const handleCreateAgentChat = () => {
        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const agentChatRef = ref(database, `users/${userId}/chat/agent/${heroName}`);
            set(agentChatRef, { heroName })
                .then(() => {
                    navigation.navigate('Chat', { heroName });
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
            <Text style={styles.title}>Avec quel héros voulez-vous discuter?</Text>
            <TextInput
                style={styles.input}
                placeholder="Nom du Héros"
                value={heroName}
                onChangeText={setHeroName}
            />
            <TouchableOpacity style={styles.button} onPress={handleCreateAgentChat}>
                <Text style={styles.buttonText}>Créer la Discussion</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        height: 50,
        top: 10,
        left: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 50,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 15,
        borderRadius: 4,
    },
    button: {
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
    editButton: {
        backgroundColor: 'orange', // Couleur de fond orange
        padding: 10, // Padding pour un aspect plus gros et confortable
        borderRadius: 5, // Bordures arrondies
        alignItems: 'center', // Centrage du texte sur l'axe horizontal
        justifyContent: 'center', // Centrage du texte sur l'axe vertical
        marginTop: 10, // Marge en haut pour le détacher des autres éléments
    },
    editButtonText: {
        color: 'white', // Couleur du texte en blanc
        fontSize: 16, // Taille de la police
        fontWeight: 'bold', // Gras pour rendre le texte plus lisible
    },
});

export default NewAgent;