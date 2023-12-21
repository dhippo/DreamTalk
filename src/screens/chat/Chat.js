// src/screens/chat/Chat.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ScrollView, StyleSheet } from 'react-native';
import { chatWithOpenAi } from '../../../api';
import { useRoute } from '@react-navigation/native';
import { auth, database } from '../../../firebaseConfig';
import {ref, push, onValue, set} from 'firebase/database';

const Chat = () => {
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [heroName, setHeroName] = useState('Superman');
    const route = useRoute();
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    useEffect(() => {
        if (route.params?.heroName) {
            setHeroName(route.params.heroName);
        }
        const messagesRef = ref(database, `users/${userId}/chat/agent/${heroName}/messages`);
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setMessages(Object.values(data));
            }
        });
    }, [route.params?.heroName, userId, heroName]);

    const handleSend = async () => {
        if (!userInput.trim()) return;

        const messagesRef = ref(database, `users/${userId}/chat/agent/${heroName}/messages`);
        const newMessageRef = push(messagesRef);

        // Enregistrer le message de l'utilisateur
        set(newMessageRef, { emailAsker: auth.currentUser?.email, content: userInput });

        const preprompt = `Réponds comme si tu étais ${heroName}: `;
        const fullMessage = preprompt + userInput;
        const aiResponse = await chatWithOpenAi(fullMessage);

        // Enregistrer la réponse de l'IA
        const newResponseRef = push(messagesRef);
        set(newResponseRef, { heroName, modelUsed: 'gpt-3.5-turbo', content: aiResponse });

        setUserInput('');
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.messageContainer}>
                {messages.map((message, index) => (
                    <View key={index} style={styles.messageBubble}>
                        <Text style={styles.messageText}>{message.content}</Text>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={`Posez votre question à ${heroName}...`}
                    value={userInput}
                    onChangeText={setUserInput}
                />
                <Button title="Envoyer" onPress={handleSend} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messageContainer: {
        flex: 1,
        padding: 10,
    },
    messageBubble: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        // Aligner à droite ou à gauche selon l'expéditeur
    },
    messageText: {
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
    },
    input: {
        flex: 1,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
    },
    // ...autres styles si nécessaires
});

export default Chat;
