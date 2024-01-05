import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../../../firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';
import {onValue, ref} from "firebase/database";
import { database } from '../../../firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';

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
                        email: userEmail
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
        <View style={profileStyles.container}>
            <LinearGradient
                colors={['#f414db', '#2a44ff']}
                style={profileStyles.gradientHeader}
            >
                <Text style={profileStyles.headerTitle}>mon profil</Text>
                <Text style={profileStyles.headerTitleEmail}>{userProfile.email}</Text>
            </LinearGradient>

            <View style={profileStyles.infoContainer}>
                <Text style={profileStyles.infoLabel}>Pseudo :</Text>
                <Text style={profileStyles.info}>{userProfile.username}</Text>

                <Text style={profileStyles.infoLabel}>Nom :</Text>
                <Text style={profileStyles.info}>{userProfile.name}</Text>

                <Text style={profileStyles.infoLabel}>Prénom :</Text>
                <Text style={profileStyles.info}>{userProfile.firstname}</Text>

            </View>

            <View style={profileStyles.buttonContainer}>
                <TouchableOpacity style={profileStyles.button} onPress={() => navigation.navigate('UpdateProfil', { userProfile })}>
                    <Text style={profileStyles.buttonText}>modifier le profil</Text>
                </TouchableOpacity>

                <TouchableOpacity style={profileStyles.button} onPress={() => navigation.navigate('Settings')}>
                    <Text style={profileStyles.buttonText}>paramètres</Text>
                </TouchableOpacity>

                <TouchableOpacity style={profileStyles.button} onPress={handleLogout}>
                    <Text style={profileStyles.buttonText}>déconnexion</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const profileStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    gradientHeader: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#ffffff',
        fontWeight: '900',
        fontSize: 29,
        marginBottom: 10,
    },
    headerTitleEmail: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 26,
    },
    infoContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 5,
        borderColor: '#000',
        borderWidth: 1,
        textAlign: 'center',
    },
    infoLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5,
    },
    info: {
        fontSize: 16,
        marginBottom: 10,
        color: '#000',
    },
    buttonContainer: {
        display: 'flex',
        width: '100%',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: '70%',
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
    },
});

export default InfoProfil;