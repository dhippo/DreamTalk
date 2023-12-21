import React, { useState, useEffect, isLoading, ActivityIndicator } from 'react';
import { Image, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

import { database } from '../../../firebaseConfig';
import { ref, set, push, update } from 'firebase/database';

import { auth } from '../../../firebaseConfig';
import { MaterialIcons } from "@expo/vector-icons";

import { verifName } from '../../../api';

const NewTalk = ({ navigation }) => {

    const [name, setName] = useState('');
    // const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const callApi = async (name) => {
        // Active le gif
        setIsLoading(true);
        const fullMessage = "Tu dois me répondre uniquement par 'Oui' ou par 'Non': Parmi ces propositions ['Personnage réel','Personnage fictif','Objet','Lieu' ], est ce que le mot '"+name+"' peut être considéré comme une référence qui fait partie de ces propositions ?";
        var aiResponse;
        console.log(fullMessage);
        try {
            aiResponse = await verifName(fullMessage);
            
        } catch (error) {
            Alert.alert("Erreur", error.message);
        } finally {
            // Désactive le gif
            setIsLoading(false); 
            return aiResponse;
            // setResponse(aiResponse);
        }
    };

    const handleSaveTalk = () => {
        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const newTalkRef = push(ref(database, `talks`));
            const newTalkUser = ref(database, `users/${userId}/talks`);
            const updates = {};
            updates[newTalkRef.key] = true;
            callApi(name).then(result => {
                console.log(result);
                if(result.includes("Oui")){
                    
                    set(newTalkRef, {
                        participants: [userId, name],
                        lastMessage: "",
                        lastActivity: Date.now(),
                         // const timestamp = 1703082786449;
                        // const date = new Date(timestamp);
                        // console.log(date.toString());
    
                        
                    })
                        .then(() => {
                            Alert.alert("Nouvelle discussion crée:", `Avec ${name}`, [
                                { text: "Nice ", onPress: () => navigation.navigate('talk', { talk: newTalkRef.key }) }
                            ]);
                        })
                        .catch((error) => {
                            Alert.alert("Erreur", error.message);
                        });

                    update(newTalkUser, updates)
                        .then(() => {
                        
                        })
                        .catch((error) => {
                            Alert.alert("Erreur", error.message);
                        });
                }else if(result.includes("Non")) {
                    Alert.alert("N'exègeres pas non plus !", `${name}, serieusement ?!`);
                }else{
                    Alert.alert("Erreur", "Echec, veuillez reessayer plus tard.");
                }
            });

        } else{
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
                    placeholder="Naruto, Melanchon, Pharaon, bouchon de bouteille..."
                    value={name}
                    onChangeText={setName}
                    style={styles.textInput}
                    maxLength={40}
                />
                {isLoading && (
                    <Image source={require('../../../assets/gifs/loading.gif')} />
                )}
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
        fontSize: 15,
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
