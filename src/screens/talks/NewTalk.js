import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { set, ref, push, get, update } from 'firebase/database';
import { auth } from '../../../firebaseConfig';
import { database } from '../../../firebaseConfig';

const NewTalk = ({ navigation }) => {
    const userId = auth.currentUser.uid;
    const [contacts, setContacts] = useState([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const contactsRef = ref(database, `users/${userId}/contacts`);
        get(contactsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const contactsArray = Object.entries(snapshot.val()).map(([key, value]) => ({
                    id: key,
                    ...value,
                }));
                setContacts(contactsArray);
            } else {
                setContacts([]);
            }
        }).catch(error => {
            Alert.alert('Erreur de chargement', error.message);
        });
    }, [userId]);

    const handleSaveTalk = (contact) => {
        const newTalkRef = push(ref(database, 'talks'));
        const newTalkUser = ref(database, `users/${userId}/talks`);
        const newContactTalk = ref(database, `users/${contact.id}/talks`);
        const updates = {};
        updates[newTalkRef.key] = true;
        var username;
        const profileRef = ref(database, `users/${auth.currentUser.uid}/profile`);
        get(profileRef).then((snapshot) => {
            if (snapshot.exists()) {

                const userData = snapshot.val();
                username = userData.username;
                console.log(username);
                // On enregistre dans la branch discussion une nouvelle discu
                set(newTalkRef, {
                    participants: { [username]: true, [contact.name]: true },
                    lastMessage: '',
                    lastActivity: Date.now(),
                })
                    .then(() => {
                        Alert.alert('Nouvelle discussion créée', `Avec ${contact.name}`);
                        navigation.navigate('Talk', { talkId: newTalkRef.key });
                    })
                    .catch((error) => {
                        Alert.alert('Erreur', error.message);
                    });

                //On met à jour la lists des discu du user
                update(newTalkUser, updates)
                    .then(() => {

                    })
                    .catch((error) => {
                        Alert.alert("Erreur", error.message);
                    });

                update(newContactTalk, updates)
                    .then(() => {

                    })
                    .catch((error) => {
                        Alert.alert("Erreur", error.message);
                    });

            }
        })
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.contactInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.type}>{item.type}</Text>
            </View>
            <TouchableOpacity
                style={styles.talkButton}
                onPress={() => handleSaveTalk(item)}
            >
                <Text style={styles.talkButtonText}>Créer une discussion</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Recherche par nom..."
            />
            <FlatList
                data={contacts.filter(contact =>
                    contact.name.toLowerCase().includes(searchText.toLowerCase())
                )}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchBar: {
        height: 40,
        borderWidth: 1,
        paddingLeft: 20,
        margin: 10,
        borderColor: '#009688',
        backgroundColor: 'white',
    },
    itemContainer: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    contactInfo: {
        flex: 1,
    },
    name: {
        fontSize: 18,
    },
    type: {
        fontSize: 14,
        color: 'grey',
    },
    talkButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#4CAF50',
        borderRadius: 20,
    },
    talkButtonText: {
        color: 'white',
        fontSize: 14,
    },
});

export default NewTalk;
