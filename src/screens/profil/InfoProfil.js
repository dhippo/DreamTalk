import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../../../firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';
import {onValue, ref} from "firebase/database";
import { database } from '../../../firebaseConfig';


const InfoProfil = ({ navigation }) => {
    const [userProfile, setUserProfile] = useState({
        username: '',
        name: '',
        email: auth.currentUser.email,
        firstname: ''
    });

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {

            // Récupération de l'email depuis l'authentification Firebase

            const userEmail = user.email || '';

            const profileRef = ref(database, `users/${user.uid}/profile`);
            const unsubscribe = onValue(profileRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setUserProfile({
                        name: data.name || '',
                        firstname: data.firstname || '',
                        username: data.username || '',
                        email: userEmail  // Utilisation de l'email récupéré
                    });
                }
            });

            return () => unsubscribe();
        }
    }, []);

    const handleLogout = () => {
        auth.signOut()
            .then(() => {

                navigation.navigate('WelcomeScreen1');
            })
            .catch((error) => {

                console.error("Erreur de déconnexion: ", error);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Profil</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.info}>Username : {userProfile.username}</Text>
                <Text style={styles.info}>Nom : {userProfile.name}</Text>
                <Text style={styles.info}>Prénom : {userProfile.firstname}</Text>
                <Text style={styles.info}>Email : {userProfile.email}</Text>

            </View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UpdateProfil', { userProfile })}>
                <Text style={styles.buttonText}>Modifier le Profil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
                <Text style={styles.buttonText}>Modifier les Paramètres</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Déconnexion</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
        backgroundColor: 'white', // Fond blanc
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'black',
    },
    infoContainer: {
        backgroundColor: 'white', // Fond blanc pour les infos
        padding: 15,
        borderRadius: 5,
        borderColor: 'orange', // Bordure orange
        borderWidth: 1,
        marginBottom: 20,
    },
    info: {
        fontSize: 18,
        marginBottom: 10,
        color: 'black', // Texte noir pour contraste
    },
    button: {
        backgroundColor: 'orange', // Bouton orange
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white', // Texte blanc
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default InfoProfil;
