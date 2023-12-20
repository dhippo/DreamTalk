import React, {useEffect, useState} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { onValue, ref } from 'firebase/database';
import { database } from '../../../firebaseConfig';
import { auth } from '../../../firebaseConfig';

const Talks = ({ navigation }) => {
    const [talks, setTalks] = useState([]);

    useEffect(() => {
        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const talksRef = ref(database, `users/${userId}/talks`);

            const list_talks = onValue(talksRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const talksArray = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }));
                    setTalks(talksArray);
                } else {
                    setTalks([]);
                }
            });

            // Retourne une fonction de nettoyage qui se désabonne de l'écouteur lors du démontage du composant
            return () => list_talks();
        }
    }, []);

    const handleAddTalk = () => {
        navigation.navigate('NewTalk');
    };

    const renderEmptyList = () => (
        <View style={styles.emptyList}>
            <Text style={styles.emptyText}>Aucun contact disponible.</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Liste des discussions</Text>
            <FlatList
                data={talks}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.talkItem}
                        onPress={() => navigation.navigate('Talk', { talks: item })}
                    >
                        <Text style={styles.talkName}>{item.firstname} {item.name}</Text>
                        {/* <Text style={styles.lastMsg}>{item.email}</Text> */}
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
                ListEmptyComponent={renderEmptyList}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddTalk}>
                <Text style={styles.addButtonText}>Nouvelle discussion</Text>
            </TouchableOpacity>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    talkItem: {
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10
    },
    talkName: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    lastMsg: {
        color: '#666'
    },
    emptyList: {
        marginTop: 50,
        alignItems: 'center'
    },
    emptyText: {
        color: '#bbb'
    },
    addButton: {
        backgroundColor: '#0066cc',
        padding: 10,
        borderRadius: 5,
        marginTop: 20
    },
    addButtonText: {
        color: '#fff',
        textAlign: 'center'
    }
});

export default Talks;