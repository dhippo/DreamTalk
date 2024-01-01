// Users/macbook/bachelor3/app-hybride/DreamTalk/src/screens/profil/InfoProfil.js
import React, {useEffect, useState} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../../../firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';
import {onValue, ref} from "firebase/database";
import { database } from '../../../firebaseConfig';


const InfoProfil = ({ navigation }) => {
    const [userProfile, setUserProfile] = useState({
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
            <Image source={require('./../../../assets/logo2.png')} style={styles.profilePic} />
            <Text style={styles.userName}>{userProfile.name}</Text>
            {/* ... Autres éléments de profil comme l'email, etc. */}
            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('UpdateProfil', { userProfile })}>
                    <MaterialIcons name="edit" size={24} color="black" />
                    <Text style={styles.menuText}>Modifier le Profil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
                    <MaterialIcons name="settings" size={24} color="black" />
                    <Text style={styles.menuText}>Paramètres</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                    <MaterialIcons name="logout" size={24} color="black" />
                    <Text style={styles.menuText}>Déconnexion</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5', // Couleur de fond de la maquette
    },
    profilePic: {
        width: 120,
        height: 120,
        borderRadius: 60, // Rendre l'image de profil circulaire
        marginBottom: 10,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4A4A4A', // Couleur du texte de la maquette
        marginBottom: 20,
    },
    menuContainer: {
        width: '100%',
        // Ajoutez des styles supplémentaires si nécessaire
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // Fond blanc pour les éléments de menu
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0', // Ligne séparatrice
        marginBottom: 10,
    },
    menuText: {
        fontSize: 18,
        color: '#4A4A4A', // Couleur du texte correspondant à la maquette
        marginLeft: 15,
    },
});

export default InfoProfil;
