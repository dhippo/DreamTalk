import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { getDatabase, set, ref, push, get, onValue } from 'firebase/database'; // Importez les fonctions nécessaires
import { auth } from '../../../firebaseConfig';

const Talk = ({ route, navigation }) => {
    const userId = auth.currentUser.uid;
    const { talkId } = route.params;
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        // Récupération initiale des messages
        const fetchMessages = async () => {
            const snapshot = await get(ref(getDatabase(), `talks/${talkId}/messages`));
            if (snapshot.exists()) {
                const loadedMessages = [];
                // On va parcourir tout ce quon à recu
                snapshot.forEach((childSnapshot) => {
                    const messageData = childSnapshot.val();
                    loadedMessages.push(messageData);
                });

                // Tri par timestamp décroissant
                loadedMessages.sort((a, b) => b.timestamp - a.timestamp);
                setMessages(loadedMessages);
            } else {
                setMessages([]);
            }
        };

        fetchMessages();

        const unsubscribe = onValue(ref(getDatabase(), `talks/${talkId}/messages`), (snapshot) => {
            if (snapshot.exists()) {
                const updatedMessages = [];
                snapshot.forEach((childSnapshot) => {
                    const messageData = childSnapshot.val();
                    updatedMessages.push(messageData);
                });
                updatedMessages.sort((a, b) => b.timestamp - a.timestamp);
                setMessages(updatedMessages);
            } else {
                setMessages([]);
            }
        });

        // Fonction de nettoyage pour désabonner lors du démontage du composant
        return () => unsubscribe();
    }, [talkId]);

    const handleSendMessage = async () => {
        if (inputText.trim()) {
            const newMessageRef = push(ref(getDatabase(), `talks/${talkId}/messages`));
            try {
                // Enregistrez le nouveau message dans Firebase
                await set(newMessageRef, {
                    senderId: userId,
                    text: inputText,
                    timestamp: Date.now(),
                });

            } catch (error) {
                console.error('Erreur lors de l\'envoi du message:', error);
                Alert.alert('Erreur', error.message);
            }
        }
    };

    const renderMessageItem = ({ item }) => {
        // Affichez les informations de l'élément dans la console
        console.log('renderMessageItem item:', item.text);

        return (
            <View style={styles.messageItem}>
                <Text style={styles.messageText}>{item.text}</Text>
                {/* Vous pouvez ajouter plus de logique ici si nécessaire */}
            </View>
        );
    };
    // messages.forEach(element => {
    //     console.log('messages:', element.text);
    // });
    return (

        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={100}
        >
            <FlatList
                inverted
                data={messages}
                renderItem={renderMessageItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.messagesList}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Écrivez votre message ici..."
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Text style={styles.sendButtonText}>Envoyer</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Assurez-vous que le conteneur parent prend toute la place
        backgroundColor: '#fff', // ou toute autre couleur de fond
    },
    messagesList: {
        flex: 1, // La FlatList doit prendre tout l'espace disponible
    },
    messageItem: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: 'lightgrey', // Une couleur de fond pour que les messages soient visibles
        borderRadius: 5,
    },
    messageText: {
        fontSize: 16, // Assurez-vous que la taille de la police est suffisante pour être lue
        color: 'black', // Assurez-vous que la couleur du texte contraste avec l'arrière-plan
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        padding: 10,
    },
    sendButton: {
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    sendButtonText: {
        color: 'white',
    },
});

export default Talk;
