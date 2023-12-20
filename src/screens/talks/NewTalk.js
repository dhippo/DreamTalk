import React, { useState } from 'react';
import { Image, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';

import { database } from '../../../firebaseConfig';
import { ref, set, push } from 'firebase/database';

import { auth } from '../../../firebaseConfig';
import { MaterialIcons } from "@expo/vector-icons";
// import { acceptsLanguage } from 'express/lib/request';

const NewTalk = ({ navigation }) => {

    const [name, setName] = useState('');

    const handleSaveTalk = () => {
        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const newTalkRef = push(ref(database, `talks`));
            
            // const timestamp = 1703082786449;
            // const date = new Date(timestamp);
            // console.log(date.toString());

            set(newTalkRef, {
                participants: [userId, name], // ID de l'utilisateur actuel et ID de l'autre participant
                lastMessage: "",
                lastActivity: Date.now(),
                
            })
                .then(() => {
                    Alert.alert("Nouvelle discussion crée:", `Avec ${name}`, [
                        { text: "Nice ", onPress: () => navigation.navigate('talk', { talk: newTalkRef.name }) }
                    ]);
                })
                .catch((error) => {
                    Alert.alert("Erreur", error.message);
                });
            Alert.alert("Nouvelle discussion crée:", `Avec ${name}`);

        } else {
            Alert.alert("Erreur", "Aucun utilisateur connecté");
        }

    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={32} color="black" />
            </TouchableOpacity>
            <Text style={styles.header}>Nouvelle discussion</Text>
            <View style={styles.form}>
                <TextInput
                    placeholder="Nom du contact"
                    value={name}
                    onChangeText={setName}
                    style={styles.textInput}
                />
                <TouchableOpacity style={styles.button} onPress={handleSaveTalk}>
                    <Text style={styles.buttonText}>Créer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({  

    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    form: {
        flex: 1,
        justifyContent: 'center',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        fontSize: 18,
        borderRadius: 6,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#0066cc',
        padding: 15,
        borderRadius: 6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
    backButton: {
        marginBottom: 20,
    },

})

export default NewTalk;
