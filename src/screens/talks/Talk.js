import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { set, ref, push, get, onValue } from 'firebase/database'; // Importez les fonctions nécessaires
import { auth } from '../../../firebaseConfig';
import { database } from '../../../firebaseConfig';
import { chatWithOpenAi } from '../../../api';
const Talk = ({ route, navigation }) => {
    const userId = auth.currentUser.uid;
    const { talkId, userReicever } = route.params;
    const [typeContact, setTypeContact] = useState('');
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [lastMsgsApi, setlastMsgsApi] = useState([]);

    // Retrieve the type of userReicever from `users/${userId}/contacts/key/`
    const contactsRef = ref(database, `users/${userId}/contacts`);

    // To find out if the user is an agent or not
    useEffect(() => {
        get(contactsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const contacts = Object.values(snapshot.val());
                const contact = contacts.find((c) => c.name === userReicever);
                setTypeContact(contact ? contact.type : 'Type non trouvé');
            } else {
                console.log("Aucun contact trouvé.");
            }
        }).catch(console.error);
    }, [userId, userReicever]); // Only re-run the effect if userId or userReicever changes

    //  Lorsque le composant est actif
    useEffect(() => {
        const processSnapshot = (snapshot) => {
            const messages = [];
            snapshot.forEach((childSnapshot) => {
                messages.push(childSnapshot.val());
            });
            return messages.sort((a, b) => b.timestamp - a.timestamp);
        };

        // On recupere tous les msg de la discu
        const fetchInitialMessages = async () => {
            const snapshot = await get(ref(database, `talks/${talkId}/messages`));
            if (snapshot.exists()) {
                const initialMessages = processSnapshot(snapshot);
                // on initie les msgs dans "messages"
                setMessages(initialMessages);
                // on initie les msgs dans "lastMsgsApi" pour le futur envoie à l'api
                setlastMsgsApi(initialMessages.map(msg => ({
                    role: msg.senderId === userId ? "user" : "assistant",
                    content: msg.text
                })));
            }
        };

        fetchInitialMessages();

        // Mettre à jour les messages lorsque la base de données change
        const unsubscribe = onValue(ref(database, `talks/${talkId}/messages`), (snapshot) => {
            if (snapshot.exists()) {
                setMessages(processSnapshot(snapshot));
            }
        });

        return () => unsubscribe(); // Cleanup function to unsubscribe on component unmount
    }, [talkId]); // Only re-run the effect if talkId changes

    const handleSendMessage = async () => {
        const text = inputText.trim();
        if (text.length > 0) {
            const newMessageRef = push(ref(database, `talks/${talkId}/messages`));
            const lastMsgRef = ref(database, `talks/${talkId}/lastMessage`);
            
            try {
                await set(newMessageRef, {
                    senderId: userId,
                    text: text,
                    timestamp: Date.now(),
                });
                await set(lastMsgRef, text);
                setInputText('');

                // Si on parle à un agent
                if (typeContact === "agent") {
                    console.log("Msg envoyé à un agent");
                    const newMsgs = [...lastMsgsApi, {
                        role: "system",
                        content: `Je suis un utilisateur qui veux parler à ${userReicever}, je veux donc que tu incarnes ${userReicever} en integrant toute sa personnalité, sa vie, toutes ses connaissances et tout son savoir. Tu dois avoir ses traits de caractère, son vocabulaire et son style. Tu dois t’exprimer exactement comme si je m’adressais à ${userReicever} en utilisant son vocabulaire. Tes réponses doivent être cohérentes avec la personnalité de ${userReicever}. Tu dois absolument retenir toute notre conversation. Tes reponses ne doivent pas depasser 100 caractertes à par si tu as vriaiment besoin de plus pour répondre à une question qui te demande de developper.`
                    }, {
                        role: "user",
                        content: text
                    }];
                    const response = await chatWithOpenAi(newMsgs);
                    if (response.success) {
                        console.log("Reponse de l'api success");

                        const newMsgs = [...lastMsgsApi, {
                            role: "assistant",
                            content: response.response
                        }];
                        // enregistrer le msg dans la base de donnée
                        await set(newMessageRef, {
                            senderId: "assistant",
                            text: response.response,
                            timestamp: Date.now(),
                        });
                        await set(lastMsgRef, response.response);

                        // setlastMsgsApi(newMsgs);
                        // console.log(newMsgs);
                    } else {
                        console.log("Erreur lors de la communication avec OpenAI");
                    }
                    
                    setlastMsgsApi(newMsgs);
                    // console.log(newMsgs);

                }

            } catch (error) {
                console.error('Erreur lors de l\'envoi du message:', error);
                Alert.alert('Erreur', error.message);
            }
        }
    };

    const renderMessageItem = ({ item }) => {

        // Affichez les informations de l'élément dans la console
        if (item.senderId === userId) {
            return (
                <View style={styles.messageSendItem}>
                    <Text style={styles.messageSend}>{item.text}</Text>
                    {/* Vous pouvez ajouter plus de logique ici si nécessaire */}
                </View>
            );
        } else {
            return (
                <View style={styles.messageReceiveItem}>
                    <Text style={styles.messageReceive}>{item.text}</Text>
                    {/* Vous pouvez ajouter plus de logique ici si nécessaire */}
                </View>
            );
        }
    };

    return (

        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={100}
        >
            <FlatList
                inverted
                data={messages}
                renderItem={renderMessageItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.messagesList}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Écrivez votre message ici..."
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Text style={styles.sendButtonText}>Envoyer</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Assurez-vous que le conteneur parent prend toute la place
        backgroundColor: '#EDEEF0', // ou toute autre couleur de fond
    },
    messagesList: {
        flex: 1, // La FlatList doit prendre tout l'espace disponible
        backgroundColor: '#EDEEF0', // ou toute autre couleur de fond
    },
    messageSendItem: {
        padding: 10,
        marginVertical: 2,
        marginEnd: 5,
        alignSelf: 'flex-end',
        backgroundColor: '#0f815c', // Une couleur de fond pour que les messages soient visibles
        flexDirection: 'row', // 
        maxWidth: '70%',
        borderRadius: 5,
        // #f9fafb
    },
    messageSend: {
        fontSize: 16, // Assurez-vous que la taille de la police est suffisante pour être lue
        color: 'white', // Assurez-vous que la couleur du texte contraste avec l'arrière-plan
    },
    messageReceiveItem: {
        padding: 10,
        marginVertical: 2,
        marginStart: 5,
        alignSelf: 'flex-start',
        backgroundColor: 'blue', // Une couleur de fond pour que les messages soient visibles
        flexDirection: 'row', // 
        maxWidth: '70%',
        borderRadius: 5,
    },
    messageReceive: {
        fontSize: 16, // Assurez-vous que la taille de la police est suffisante pour être lue
        color: 'white',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    input: {
        flex: 1,
        padding: 10,
        marginRight: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
    },
    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#0a5e43',
        borderRadius: 20,
    },
    sendButtonText: {
        color: 'white',
    },
});

export default Talk;
