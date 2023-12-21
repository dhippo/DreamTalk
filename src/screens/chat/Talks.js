// src/screens/chat/Talks.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { database } from '../../../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { auth } from '../../../firebaseConfig';

const Talks = ({ navigation }) => {
    const [discussions, setDiscussions] = useState([]);

    useEffect(() => {
        const userId = auth.currentUser ? auth.currentUser.uid : null;
        const agentChatsRef = ref(database, `users/${userId}/chat/agent`);
        const friendChatsRef = ref(database, 'discussions');

        const handleData = (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const formattedData = Object.keys(data).map(key => ({
                    type: snapshot.ref.key === `users/${userId}/chat/agent` ? 'Agent' : 'Friend',
                    id: key,
                    details: data[key]
                }));
                setDiscussions(discussions => [...discussions, ...formattedData]);
            }
        };

        onValue(agentChatsRef, handleData);
        onValue(friendChatsRef, handleData);

        return () => {
            // Clean-up listeners
            agentChatsRef.off('value', handleData);
            friendChatsRef.off('value', handleData);
        };
    }, []);

    const handleNewTalk = () => {
        navigation.navigate('NewTalk');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Liste des Discussions</Text>
            <ScrollView>
                {discussions.map((discussion, index) => (
                    <TouchableOpacity key={index} style={styles.contactItem} onPress={() => navigation.navigate('Chat', { discussionId: discussion.id })}>
                        <Text style={styles.contactName}>Discussion: {discussion.id}</Text>
                        <Text style={styles.contactEmail}>Type: {discussion.type}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <TouchableOpacity style={styles.addButton} onPress={handleNewTalk}>
                <Text style={styles.addButtonText}>Nouvelle Discussion</Text>
            </TouchableOpacity>
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    contactItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'white',
        width: '100%',
    },
    contactName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    contactEmail: {
        fontSize: 16,
        color: 'gray',
    },
    addButton: {
        position: 'absolute',
        textAlign: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: 'orange',
        width: 200,
        height: 50,
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
    },
    addButtonText: {
        color: 'white',
        fontSize: 19,
        textAlign: 'center',
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 18,
        color: 'gray',
    }
});

export default Talks;
