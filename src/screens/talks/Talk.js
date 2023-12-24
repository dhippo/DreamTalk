import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { getDatabase, set, ref, push, get, onValue } from 'firebase/database'; // Importez les fonctions nécessaires
import { auth } from '../../../firebaseConfig';

const Talk = ({ route, navigation }) => {
    const userId = auth.currentUser.uid;
    const { talkId } = route.params;
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    console.log('talkId:', talkId);
    console.log('messages:', messages);
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
            const lastMsgRef = ref(getDatabase(), `talks/${talkId}/lastMessage`);
            try {
                // Enregistrez le nouveau message dans Firebase
                await set(newMessageRef, {
                    senderId: userId,
                    text: inputText,
                    timestamp: Date.now(),
                });
                // Mettre à jour le dernier message de la discussion
                await set(lastMsgRef, inputText);
                // Effacer le champ de saisie
                setInputText('');


            } catch (error) {
                console.error('Erreur lors de l\'envoi du message:', error);
                Alert.alert('Erreur', error.message);
            }
        }
    };

    const renderMessageItem = ({ item }) => {
        // Affichez les informations de l'élément dans la console
        if (item.senderId === userId) {
            return (
                <View style={styles.messageSendItem}>
                    <Text style={styles.messageSend}>{item.text}</Text>
                    {/* Vous pouvez ajouter plus de logique ici si nécessaire */}
                </View>
            );
         }else{
            return (
            <View style={styles.messageReceiveItem}>
                    <Text style={styles.messageReceive}>{item.text}</Text>
                    {/* Vous pouvez ajouter plus de logique ici si nécessaire */}
                </View>
            );
         }
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
        backgroundColor: '#dae0e5', // ou toute autre couleur de fond
    },
    messageSendItem: {
        padding: 10,
        marginVertical: 2,
        marginEnd: 5,
        alignSelf: 'flex-end',
        backgroundColor: '#0f815c', // Une couleur de fond pour que les messages soient visibles
        flexDirection: 'row', // 
        maxWidth: '70%',
        borderRadius: 5,
        // #f9fafb
    },
    messageSend: {
        fontSize: 16, // Assurez-vous que la taille de la police est suffisante pour être lue
        color: 'white', // Assurez-vous que la couleur du texte contraste avec l'arrière-plan
    },
    messageReceiveItem: {
        padding: 10,
        marginVertical: 2,
        marginStart: 5,
        alignSelf: 'flex-start',
        backgroundColor: 'blue', // Une couleur de fond pour que les messages soient visibles
        flexDirection: 'row', // 
        maxWidth: '70%',
        borderRadius: 5,
    },
    messageReceive: {
        fontSize: 16, // Assurez-vous que la taille de la police est suffisante pour être lue
        color: 'white',
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
        backgroundColor: '#0a5e43',
        borderRadius: 20,
    },
    sendButtonText: {
        color: 'white',
    },
});

export default Talk;
