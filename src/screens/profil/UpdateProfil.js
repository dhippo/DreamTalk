import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { database, auth } from '../../../firebaseConfig';
import { ref, set } from 'firebase/database';
import {MaterialIcons} from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const UpdateProfil = ({ route, navigation }) => {
    const { userProfile } = route.params;
    const [name, setName] = useState(userProfile.name);
    const [username, setUsername] = useState(userProfile.username);
    const [firstname, setFirstname] = useState(userProfile.firstname);

    const handleSaveChanges = () => {
        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            // Chemin pour les données de profil
            const profileRef = ref(database, `users/${userId}/profile`);

            if (username === '' ) {
                alert("Veuillez saisir un username !");
                return;
            }

            set(profileRef, {
                username: username.trim(),
                name: name.trim(),
                firstname: firstname.trim()
            })
                .then(() => {
                    Alert.alert("Profil mis à jour", "Les informations ont été enregistrées.", [
                        { text: "OK", onPress: () => navigation.goBack() }
                    ]);
                })
                .catch((error) => {
                    Alert.alert("Erreur", error.message);
                });
        } else {
            Alert.alert("Erreur", "Aucun utilisateur connecté");
        }
    };

    return (
        <View style={updateProfileStyles.container}>
            <LinearGradient
                colors={['#f414db', '#2a44ff']}
                style={updateProfileStyles.gradientHeader}
            >
                <TouchableOpacity style={updateProfileStyles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={32} color="#ffffff" />
                </TouchableOpacity>
                <Text style={updateProfileStyles.headerTitle}>Modifier mon profil</Text>
            </LinearGradient>

            <View style={updateProfileStyles.contentContainer}>
                <TextInput
                    style={updateProfileStyles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Nom d'utilisateur"
                    placeholderTextColor="#aaa"
                />
                <TextInput
                    style={updateProfileStyles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Nom"
                    placeholderTextColor="#aaa"
                />
                <TextInput
                    style={updateProfileStyles.input}
                    value={firstname}
                    onChangeText={setFirstname}
                    placeholder="Prénom"
                    placeholderTextColor="#aaa"
                />
                <TouchableOpacity style={updateProfileStyles.saveButton} onPress={handleSaveChanges}>
                    <Text style={updateProfileStyles.saveButtonText}>Enregistrer les modifications</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};


const updateProfileStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: '900',
        textAlign: 'center',
        flexGrow: 1,
    },
    gradientHeader: {
        paddingHorizontal: 10,
        paddingTop: 40, // assuming there's a notch or status bar
        paddingBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    backButton: {
        position: 'absolute',
        left: 10,
        top: 40,
        zIndex: 1,
    },
    contentContainer: {
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#000',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        fontSize: 16,
        color: '#000',
    },
    saveButton: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default UpdateProfil;