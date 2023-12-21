import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { getDatabase, ref, push, get, onValue } from 'firebase/database'; // Importez les fonctions nécessaires
import { auth } from '../../../firebaseConfig';

const Talk = ({ route, navigation }) => {
    const userId = auth.currentUser.uid;
    const { talkId } = route.params;
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    console.log(messages)
    useEffect(() => {
        // Récupération initiale des messages
        const fetchMessages = async () => {
            const snapshot = await get(ref(getDatabase(), `talks/${talkId}/messages`));
            if (snapshot.exists()) {
                const loadedMessages = Object.entries(snapshot.val())
                    .map(([key, msgData]) => {
                        return {
                            id: key,
                            ...msgData
                        };
                    })
                    // Tri par timestamp décroissant
                    .sort((a, b) => b.timestamp - a.timestamp);

                setMessages(loadedMessages);
                // console.log(loadedMessages);
            } else {
                setMessages([]);
            }
        };

        fetchMessages();

        const unsubscribe = onValue(ref(getDatabase(), `talks/${talkId}/messages`), (snapshot) => {
            if (snapshot.exists()) {
                const updatedMessages = Object.entries(snapshot.val())
                    .map(([key, msgData]) => {
                        return {
                            id: key,
                            ...msgData
                        };
                    })
                    .sort((a, b) => b.timestamp - a.timestamp);

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
            const newMessage = {
                senderId: userId,
                text: inputText,
                timestamp: Date.now(),
            };

            try {
                // Enregistrez le nouveau message dans Firebase
                await set(newMessageRef, newMessage);
                setMessages(previousMessages => [newMessage, ...previousMessages]);
                setInputText('');
            } catch (error) {
                console.error('Erreur lors de l\'envoi du message:', error);
                Alert.alert('Erreur', error.message);
            }
        }
    };

    const renderMessageItem = ({ item }) => (
        // affichage des messages
        <View style={styles.messageItem}>
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    return (
        <View style={styles.containerBig}>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={100}
            >
                <FlatList
                    inverted
                    data={messages}
                    renderItem={renderMessageItem}
                    keyExtractor={item => item.id}
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

        </View>

    );
};

const styles = StyleSheet.create({
    containerBig: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative',
        padding: 15,
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    messagesList: {
        flex: 1,
    },
    messageItem: {
        margin: 10,
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 10,
        maxWidth: '80%',
        alignSelf: 'flex-end',
    },
    messageText: {
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    input: {
        flex: 1,
        padding: 10,
        marginRight: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
    },
    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#0066cc',
        borderRadius: 20,
    },
    sendButtonText: {
        color: '#fff',
    },
});

export default Talk;
