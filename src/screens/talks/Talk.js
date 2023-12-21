// import React, { useState } from 'react';
// import { View, TextInput, Button, Text } from 'react-native';
// import { chatWithOpenAi } from '../../../api';

// const Talk = () => {
//     const [userInput, setUserInput] = useState('');
//     const [response, setResponse] = useState('');

//     const handleSend = async () => {
//         const preprompt = "Réponds comme si tu étais Superman: ";
//         const fullMessage = preprompt + userInput;
//         const aiResponse = await chatWithOpenAi(fullMessage);
//         setResponse(aiResponse);
//     };

//     return (
//         <View>
//             <TextInput
//                 placeholder="Posez votre question à Superman..."
//                 value={userInput}
//                 onChangeText={setUserInput}
//             />
//             <Button title="Envoyer" onPress={handleSend} />
//             <Text>Réponse de Superman: {response}</Text>
//         </View>
//     );
// };

// export default Talk;

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { getDatabase, ref, push, get, onValue } from 'firebase/database'; // Importez les fonctions nécessaires
import { auth } from '../../../firebaseConfig';

const Talk = ({ route, navigation }) => {
    const userId = auth.currentUser.uid;
    const { talkId } = route.params;
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const messagesRef = ref(getDatabase(), `talks/${talkId}/messages`);
    
    const handleEditContact = () => {
        navigation.navigate('EditContact', { contact });
    };

    useEffect(() => {
        const messagesRef = ref(getDatabase(), `talks/${talkId}/messages`);
      
        // Récupération initiale des messages
        const fetchMessages = async () => {
          try {
            const snapshot = await get(messagesRef);
            if (snapshot.exists()) {
              const loadedMessages = Object.entries(snapshot.val())
                .map(([key, value]) => ({ id: key, ...value }))
                .sort((a, b) => b.timestamp - a.timestamp); // Assurez-vous que le tri est correct
              setMessages(loadedMessages);
            } else {
              setMessages([]);
            }
          } catch (error) {
            console.error('Erreur lors de la récupération des messages:', error);
            setMessages([]);
          }
        };
      
        fetchMessages();
      
        // Écoute des changements en temps réel
        const unsubscribe = onValue(messagesRef, (snapshot) => {
          if (snapshot.exists()) {
            const updatedMessages = Object.entries(snapshot.val())
              .map(([key, value]) => ({ id: key, ...value }))
              .sort((a, b) => b.timestamp - a.timestamp);
            setMessages(updatedMessages);
          } else {
            setMessages([]);
          }
        }, {
          onlyOnce: false
        });
      
        // Fonction de nettoyage pour désabonner lors du démontage du composant
        return () => {
          unsubscribe();
        };
      }, [talkId]);


    const handleSendMessage = () => {
        if (inputText.trim()) {
            const newMessageRef = push(ref(getDatabase(), `talks/${talkId}/messages`));
            const newMessage = {
                senderId: userId,
                text: inputText,
                timestamp: Date.now(),
            };

            // Enregistrez le nouveau message dans Firebase
            push(newMessageRef, newMessage).then(() => {
                console.log('Message envoyé');
            }).catch(error => {
                console.error('Erreur lors de l\'envoi du message:', error);
            });

            setMessages(previousMessages => [newMessage, ...previousMessages]);
            setInputText('');
        }
    };

    const renderMessageItem = ({ item }) => (
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
            <TouchableOpacity style={styles.editButton} onPress={handleEditContact}>
                <Text style={styles.editButtonText}>Modifier</Text>
            </TouchableOpacity>
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
        backgroundColor: '#e0e0e0',
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
