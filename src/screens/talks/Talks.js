import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

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
    // talksArray.forEach((talk) => {
    //     const talkRef = ref(database, `talks/${talk.id}`);
    //     get(talkRef).then((talkSnapshot) => {
    //         if (talkSnapshot.exists()) {
    //             console.log(talk.id, talkSnapshot.val());
    //             // Faites ici ce que vous voulez faire avec les données de chaque talk
    //         }
    //     }).catch((error) => {
    //         console.error(error);
    //     });
    // });


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
                <Text style={styles.talkName}>{item.lastMessage}</Text>
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
      padding: 20,
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    talkItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      backgroundColor: '#f9f9f9',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    talkName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    lastMsg: {
      color: '#666',
      fontSize: 14,
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