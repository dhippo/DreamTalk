// DreamTalk/src/screens/contact/ContactInfos.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ContactInfos = ({ route, navigation }) => {
    const { contact } = route.params;

    const handleEditContact = () => {
        navigation.navigate('EditContact', { contact });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={32} color="black" />
            </TouchableOpacity>
            <Text style={styles.header}>{contact.firstname} {contact.name}</Text>
            <View style={styles.contactDetails}>
                <Text style={styles.info}>Nom: {contact.name}</Text>
                <Text style={styles.info}>Prénom: {contact.firstname}</Text>
                <Text style={styles.info}>Email: {contact.email}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleEditContact}>
                <Text style={styles.editButtonText}>Modifier</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
        backgroundColor: 'white', // Fond blanc pour l'écran
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    backButton: {
        marginBottom: 30,
        marginLeft: -20,
        marginTop: 10,
    },
    contactDetails: {
        backgroundColor: 'white', // Fond blanc pour les détails du contact
        padding: 20,
        borderRadius: 5,
        borderColor: 'orange', // Bordure orange
        borderWidth: 1,
        marginBottom: 20,
    },
    info: {
        fontSize: 18,
        marginBottom: 15,
        color: 'black', // Texte en noir pour un meilleur contraste
    },
    editButton: {
        backgroundColor: 'orange', // Bouton de modification orange
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    editButtonText: {
        color: 'white', // Texte du bouton en blanc
        fontSize: 18,
        fontWeight: 'bold',
    }
});


export default ContactInfos;
