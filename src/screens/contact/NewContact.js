// DreamTalk/src/screens/contact/NewContact.js
import React, { useState } from 'react';
import { Image, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';

import { database } from '../../../firebaseConfig';
import { ref, set, push } from 'firebase/database';

import { auth } from '../../../firebaseConfig';
import { MaterialIcons } from "@expo/vector-icons";
// import { acceptsLanguage } from 'express/lib/request';

const NewContact = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [firstname, setFirstname] = useState('');
    const [activeSide, setActiveSide] = useState('right');
    
    var contact;
    if (activeSide === 'left') {
        contact = "agent";
    }   else {
        contact = "user";
    }

    const handleSaveContact = () => {
        if (contact === "user") {
            Alert.alert(contact);
            if (auth.currentUser) {
                const userId = auth.currentUser.uid;
                const newContactRef = push(ref(database, `users/${userId}/contacts`));
                set(newContactRef, {
                    name,
                    firstname,
                    email
                })
                    .then(() => {
                        Alert.alert("Contact Sauvegardé", `Nom: ${name}\nEmail: ${email}`, [
                            { text: "OK", onPress: () => navigation.navigate('ContactsList') }
                        ]);
                    })
                    .catch((error) => {
                        Alert.alert("Erreur", error.message);
                    });
            } else {
                Alert.alert("Erreur", "Aucun utilisateur connecté");
            }
        }else{
            Alert.alert(contact);
            if (auth.currentUser) {
                const userId = auth.currentUser.uid;
                // const prompt = 
                // "Je suis un utilisateur qui veus parler à "+ name +", je veux donc que tu incarnes"+ name +" en integrant toute sa personnalité et connaissance. Tu dois avoir ses traits de caractère, son vocabulaire et son style. Tu dois t’exprimer exactement comme si je m’adressais à"+ name +". Tu vas commencer la discussion.";
                const newContactRef = push(ref(database, `users/${userId}/contacts`));
                
                set(newContactRef, {
                    name,

                })
                    .then(() => {
                        Alert.alert("Nouvel agent sauvegardé", `Nom: ${name}`, [
                            { text: "OK", onPress: () => navigation.navigate('ContactsList') }
                        ]);
                    })
                    .catch((error) => {
                        Alert.alert("Erreur", error.message);
                    });
            } else {
                Alert.alert("Erreur", "Aucun utilisateur connecté");
            }

        }
    };

    const changeContact = (side) => {
        setActiveSide(side); 
    };


    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={32} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Nouveau Contact</Text>

            <View style={styles.buttonContainer}>
    
            <View style={[styles.ActiveBtn, activeSide === 'right' ? { left: '50%' } : { right: '50%' }]} />                
                <TouchableOpacity style={styles.btnAgent} onPress={() => changeContact('left')}>
                    <Image style={styles.btnImage}
                        source={require('../../../assets/icons/bot.png')}
                    />
                    <Text style={styles.buttonText}>Nouvel Agent IA</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnUser} onPress={() => changeContact('right')}>
                    <Image style={styles.btnImage}
                        source={require('../../../assets/icons/bot.png')}
                    />
                    <Text style={styles.buttonText}>Nouveau contact</Text>
                </TouchableOpacity>


            </View>
            {activeSide === 'right' && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Nom"
                        value={name}
                        onChangeText={setName}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Prenom"
                        value={firstname}
                        onChangeText={setFirstname}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                </>
            )}
            {activeSide === 'left' && (
               <>
                    <TextInput
                        style={styles.input}
                        placeholder="A qui voulez-vous parler ?"
                        value={name}
                        onChangeText={setName}
                    />


               </>

            )}

            <TouchableOpacity style={styles.editButton} onPress={handleSaveContact}>
                <Text style={styles.editButtonText}>Enregistrer</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        height: 50,
        top: 10,
        left: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 50,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 15,
        borderRadius: 4,
    },
    button: {
        backgroundColor: 'orange',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    editButton: {
        backgroundColor: 'orange', // Couleur de fond orange
        padding: 10, // Padding pour un aspect plus gros et confortable
        borderRadius: 5, // Bordures arrondies
        alignItems: 'center', // Centrage du texte sur l'axe horizontal
        justifyContent: 'center', // Centrage du texte sur l'axe vertical
        marginTop: 10, // Marge en haut pour le détacher des autres éléments
    },
    editButtonText: {
        color: 'white', // Couleur du texte en blanc
        fontSize: 16, // Taille de la police
        fontWeight: 'bold', // Gras pour rendre le texte plus lisible
    },
    buttonContainer: {
        backgroundColor: 'grey',
        borderRadius: 10,
        marginBottom: 20,
        flexDirection: 'row', // Place les éléments en ligne
        justifyContent: 'flex-start', // Ajoute de l'espace entre les éléments
        padding: 5, // Ajoutez du padding si nécessaire
    },
    btnImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    ActiveBtn: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        margin: 4,
        width: '50%', 
        backgroundColor: 'red', 
        borderRadius: 10,
    },
    btnAgent: {
        height: 35,
        width: '45%',
        margin: 5,
        backgroundColor: 'orange',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    btnUser: {
        height: 35,
        width: '45%',
        margin: 5,
        marginLeft: '5%',
        height: 35,
        backgroundColor: 'orange',
        borderRadius: 5,
        // marginLeft: 180,
        // marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
});

export default NewContact;
