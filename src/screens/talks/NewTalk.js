import React, { useState, useEffect } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
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
                // faire la verif que la discu n'existe pas 
                    .then(() => {
                        Alert.alert('Nouvelle discussion créée', `Avec ${contact.name}`);
                        navigation.navigate('Talk', { talkId: newTalkRef.key, userReicever: contact.name});
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

    const handleAddTalk = () => {
        navigation.navigate('NewContact');
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Image style={{ width: 30, height: 30, borderRadius:10}} source={require('../../../assets/icons/welcome.png')} />
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
            <View style={styles.header}>
                <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
                    <Image style={{ width: 30, height: 30}} source={require('../../../assets/icons/btnBack.png')} />
                </TouchableOpacity>
                <Text style={{marginStart: 95, fontSize:30}}>Discussions</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleAddTalk}>
                    <Image style={{ width: 40, height:40}} source={require('../../../assets/icons/newTalk.png')} />
                </TouchableOpacity>
            </View>
            <TextInput
                style={styles.searchBar}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Recherche par nom..."
            />
            <FlatList style={styles.contactsList}
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
        paddingTop: 15,
        backgroundColor: '#EDEEF0',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        top: 50,
    },
    btnBack: {
        left: 10,
        width: 35,
        height: 35,
        // padding: 5,
        // backgroundColor: '#EBEBEB',  
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        paddingStart: 1,
        paddingTop: 2,
    },
    addButton: {
        left: 90,
    },
    searchBar: {
        top: 60,
        height: 40,
        width: '95%',
        borderWidth: 1,
        paddingLeft: 20,
        margin: 10,
        borderRadius: 10,

        backgroundColor: 'white',
    },
    contactsList: {
        top: 80,
        padding: 15,
        width: '100%',
        // backgroundColor: 'yellow',
    },
    itemContainer: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 20,
        height: 70,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        marginBottom: 10,
    },
    contactInfo: {
        flex: 1,
    },
    name: {
        left: 10,
        fontSize: 18,
    },
    type: {
        left: 10,
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
