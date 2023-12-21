import React, { useEffect, useState } from 'react';
import { Image, View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { forceLongPolling, onValue, ref, get } from 'firebase/database';
import { database } from '../../../firebaseConfig';
import { auth } from '../../../firebaseConfig';

const Talks = ({ navigation }) => {
    const [talks, setTalks] = useState([]);

    useEffect(() => {
        const fetchTalks = async () => {
            if (auth.currentUser) {
                const userId = auth.currentUser.uid;
                const userTalksRef = ref(database, `users/${userId}/talks`);

                onValue(userTalksRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        // Création d'une promesse pour chaque 'talk' pour gérer les requêtes asynchrones
                        const talksPromises = Object.keys(data).map((key) => {
                            const talkRef = ref(database, `talks/${key}`);
                            return get(talkRef).then((talkSnapshot) => {
                                if (talkSnapshot.exists()) {
                                    // Retourne l'objet 'talk' avec les données fusionnées
                                    return { id: key, ...talkSnapshot.val() };
                                }
                                return null;
                            });
                        });

                        // Attendre que toutes les promesses soient résolues
                        Promise.all(talksPromises).then((talks) => {
                            // Filtrer les valeurs null et mettre à jour l'état avec les 'talks' récupérés
                            setTalks(talks.filter(Boolean));
                        });
                    } else {
                        setTalks([]);
                    }
                });
            }
        };

        fetchTalks();
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
                        onPress={() => navigation.navigate('Talk', { talkId: item.id })}
                    >
                        <Image style={styles.talkImage} source={require('../../../assets/icons/welcome.png')} />

                        <Text style={styles.talkName}>{item.participants[1]}</Text>
                        <Text style={styles.lastMsg}>Nouvelle discussion</Text>
                        {/* <Text style={styles.talkName}>{item.lastMessage}</Text> */}
                        {/* Affichez ici d'autres informations pertinentes concernant le 'talk' */}
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
        position: 'relative',
        padding: 15,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    talkItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#a8d9e2',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginStart: 10,
        height: 70,
        width: '100%',
        marginBottom: 10,
    },
    talkImage: {
        width: 45,
        height: 45,
        borderRadius: 25,
        position: 'absolute',
        backgroundColor: 'grey',
        top: 13,
        marginStart: 10,
    },
    talkName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red',
        width: 270,
        backgroundColor: 'grey',
        marginStart: 60,

    },
    lastMsg: {
        color: '#666',
        fontSize: 12,
        backgroundColor: 'orange',
        width: 270,
        marginStart: 70,
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#bbb',
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#0066cc',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});


export default Talks;