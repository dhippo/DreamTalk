// sur cette page: bouton nouvelle discussion NewTalk.js et bouton créer un agent NewAgent.js
// avec une barre de recherche et en dessous une liste des dernières discussions

import React from 'react';
import { View, Text, FlatList } from 'react-native';

const Talks = () => {
    // Exemple de données pour les discussions
    const talks = [
        { id: '1', title: 'Discussion avec Alice' },
        { id: '2', title: 'Discussion avec Bob' },
    ];

    return (
        <View>
            <Text>Liste des Discussions</Text>
            <FlatList
                data={talks}
                renderItem={({ item }) => <Text>{item.title}</Text>}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

export default Talks;
