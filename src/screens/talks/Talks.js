import React, { useEffect, useState } from 'react';
import { Image, View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { forceLongPolling, onValue, ref, get } from 'firebase/database';
import { database } from '../../../firebaseConfig';
import { auth } from '../../../firebaseConfig';


const Talks = ({ navigation }) => {
    const [talks, setTalks] = useState([]);
    const [username, setUserName] = useState([]);
    const [searchText, setSearchText] = useState('');
    
    useEffect(() => {
        const fetchTalks = async () => {
            if (auth.currentUser) {
                const userId = auth.currentUser.uid;
                const userTalksRef = ref(database, `users/${userId}/talks`);
               
                // On recupere le suername du user connecté
                const userName = await get(ref(database, `users/${userId}/profile/username`));
                setUserName(userName)

                onValue(userTalksRef, (snapshot) => {

                    const data = snapshot.val();
                    if (data) {
                        // Compter le nombre de participants
                        const talksPromises = Object.keys(data).map(async (key) => {
                            // Références séparées pour participants et lastMessage
                            const participantsRef = ref(database, `talks/${key}/participants`);
                            const lastMessageRef = ref(database, `talks/${key}/lastMessage`);
                            
                            // Récupération des données séparément
                            const participantsSnapshot = await get(participantsRef);
                            const lastMessageSnapshot = await get(lastMessageRef);

                            var userReicever = "";
                            const userParticipant = participantsSnapshot.exists() ? participantsSnapshot.val() : {};
                            // On recuper le usernam a qui il parle
                            userReicever = (username === Object.keys(userParticipant)[0]) ? Object.keys(userParticipant)[0] : Object.keys(userParticipant)[1];
                            console.log(Object.keys(userParticipant)[0]);

                            return {
                                id: key,
                                userReicever: userReicever,
                                lastMessage: lastMessageSnapshot.exists() ? lastMessageSnapshot.val() : ""
                            };
                        });
                
                        Promise.all(talksPromises).then((talks) => {
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

    //rafraichir la page lorsqu'on revient dessus

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
            {/* container btn retour + text  */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
                    <Image style={{ width: 30, height: 30}} source={require('../../../assets/icons/btnBack.png')} />
                </TouchableOpacity>
                <Text style={{marginStart: 95, fontSize:30}}>Discussions</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleAddTalk}>
                    <Image style={{ width: 40, height:40}} source={require('../../../assets/icons/newTalk.png')} />
                </TouchableOpacity>
            </View>
            {/* <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, left: 10, width: '95%', top:60 }} /> */}

            <TextInput
                style={styles.searchBar}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Recherche"
            />
            <FlatList style={styles.talksList}
                data={talks}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.talkItem}
                        onPress={() => navigation.navigate('Talk', { talkId: item.id, userReicever: item.userReicever })}
                    >
                        <Image style={styles.talkImage} source={require('../../../assets/icons/welcome.png')} />

                        <Text style={styles.talkName}>{item.userReicever}</Text>
                        <Text style={styles.lastMsg}>{item.lastMessage}</Text>
                        {/* afficher l'icone flechTalks */}
                        <Image style={styles.fleche} source={require('../../../assets/icons/flecheTalks.png')} />
                        {/* <Text style={styles.talkName}>{item.lastMessage}</Text> */}
                        {/* Affichez ici d'autres informations pertinentes concernant le 'talk' */}
                    </TouchableOpacity>
                )}

                keyExtractor={item => item.id}
                ListEmptyComponent={renderEmptyList}
            />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#EDEEF0',
        position: 'relative',
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
    talksList: {
        padding: 15,
        flex: 1,
        width: '100%',
        marginTop: 70,
        // backgroundColor: 'red',
    },
    talkItem: {
        padding: 15,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
        // justifyContent: 'space-between',
        height: 90,
        width: '100%',
        marginBottom: 10,
    },
    talkImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        position: 'absolute',
        backgroundColor: 'grey',
        top: 20,
        marginStart: 10,
    },
    talkName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#252525',
        width: 270,
        // backgroundColor: 'grey',
        marginStart: 60,

    },
    lastMsg: {
        color: '#666',
        fontSize: 12,
        // backgroundColor: 'orange',
        top: 10,
        maxWidth: 250,
        maxHeight: 40,
        marginStart: 60,
    },
    fleche: {
        width: 18,
        height: 18,
        marginStart: 345,
        top: '-50%',
        // right: 10,
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
        left: 90,
    }

});


export default Talks;