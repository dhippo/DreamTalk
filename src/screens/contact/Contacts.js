// DreamTalk/src/screens/contact/Contacts.js
import React, {useEffect, useState} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { onValue, ref } from 'firebase/database';
import { database } from '../../../firebaseConfig';
import { auth } from '../../../firebaseConfig';

const Contacts = ({ navigation }) => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const contactsRef = ref(database, `users/${userId}/contacts`);

            // Création de l'écouteur d'événements
            const unsubscribe = onValue(contactsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const contactsArray = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }));
                    setContacts(contactsArray);
                } else {
                    setContacts([]);
                }
            });

            // Retourne une fonction de nettoyage qui se désabonne de l'écouteur lors du démontage du composant
            return () => unsubscribe();
        }
    }, []);


    const handleAddContact = () => {
        navigation.navigate('NewContact');
    };

    const renderEmptyList = () => (
        <View style={styles.emptyList}>
            <Text style={styles.emptyText}>Aucun contact disponible.</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Liste des Contacts</Text>
            <FlatList
                data={contacts}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.contactItem}
                        onPress={() => navigation.navigate('ContactInfos', { contact: item })}
                    >
                        <Text style={styles.contactName}>{item.firstname} {item.name}</Text>
                        <Text style={styles.contactEmail}>{item.email}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
                ListEmptyComponent={renderEmptyList}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
                <Text style={styles.addButtonText}>Nouveau contact</Text>
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
        width: 170,
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

export default Contacts;
