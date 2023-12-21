// src/screens/chat/FriendChat.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ScrollView, StyleSheet } from 'react-native';
import { database } from '../../../firebaseConfig';
import { ref, set, push, onValue } from 'firebase/database';
import { auth } from '../../../firebaseConfig';

const FriendChat = ({ route }) => {
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([]);
    const discussionId = route.params?.discussionId || 'default_discussion_id'; // Fallback si discussionId n'est pas défini

    useEffect(() => {
        const messagesRef = ref(database, `discussions/${discussionId}/messages`);
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setMessages(Object.values(data));
            }
        });
    }, [discussionId]);

    const handleSend = () => {
        if (!userInput.trim()) return;

        const messagesRef = ref(database, `discussions/${discussionId}/messages`);
        const newMessageRef = push(messagesRef);

        set(newMessageRef, {
            emailSender: auth.currentUser?.email,
            content: userInput
        })
            .then(() => setUserInput(''))
            .catch((error) => Alert.alert("Erreur", error.message));
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
                    placeholder="Écrivez votre message..."
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
});

export default FriendChat;
