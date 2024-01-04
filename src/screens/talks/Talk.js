import React, { useState, useEffect } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { set, ref, push, get, onValue } from 'firebase/database'; // Importez les fonctions nécessaires
import { auth } from '../../../firebaseConfig';
import { database } from '../../../firebaseConfig';
import { chatWithOpenAi } from '../../../api';
import LinearGradient from 'react-native-linear-gradient';

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
                setTypeContact(contact ? contact.type : 'user');
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
                console.log(messages);
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
                set(newMessageRef, {
                    senderId: userId,
                    text: text,
                    timestamp: Date.now(),
                });
                set(lastMsgRef, text);
                setInputText('');

                // Si on parle à un agent
                if (typeContact === "agent") {
                    console.log("Msg envoyé à un agent");
                    const newMsgs = [...lastMsgsApi, {
                        role: "system",
                        content: `Je suis un utilisateur qui veux parler à ${userReicever}, je veux donc que tu incarnes ${userReicever} en integrant toute sa personnalité, sa vie, toutes ses connaissances et tout son savoir. Tu dois avoir ses traits de caractère, son vocabulaire et son style, c'est très important! Tu dois t’exprimer exactement comme si je m’adressais à ${userReicever} en utilisant son vocabulaire et ses expressions. Tes réponses doivent être cohérentes avec la personnalité de ${userReicever}. Si il y'a un historique de la discussion, tu n'as plus besoin de te presenter. Tu dois absolument retenir toute notre conversation. Tes reponses ne doivent pas depasser 100 caractertes en moyenne, à par si tu as vriaiment besoin de plus afin de répondre à une question qui te demande de developper.`
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
                        const newMessageRef = push(ref(database, `talks/${talkId}/messages`));

                        await set(newMessageRef, {
                            senderId: "assistant",
                            text: response.response,
                            timestamp: Date.now(),
                        });
                        await set(lastMsgRef, response.response);

                        setlastMsgsApi(newMsgs);
                    } else {
                        console.log("Erreur lors de la communication avec OpenAI");
                    }                    
                //     setlastMsgsApi(newMsgs);
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
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
                    <Image style={{ width: 30, height: 30}} source={require('../../../assets/icons/btnBack.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.imgProfil} onPress={() => navigation.goBack()}>
                    <Image style={{ width: 45, height: 45, borderRadius:20}} source={require('../../../assets/icons/welcome.png')} />
                </TouchableOpacity>
                <Text style={styles.name}>{userReicever}</Text>
                <Text style={styles.type}>{typeContact}</Text>
                
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keybord}
                keyboardVerticalOffset={0}
            >
                <FlatList
                    style={styles.messagesList}
                    inverted
                    data={messages}
                    renderItem={renderMessageItem}
                    keyExtractor={(item, index) => index.toString()}
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
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        // backgroundColor: '#FDFDFD',
    },
    header: {
        top: 25,
        height: 60,
        marginBottom: 25,
        flexDirection: 'column',
        paddingTop: 10,
        paddingHorizontal:130,
        borderBottomWidth: 1,
    },
    btnBack: {
        position: 'absolute',
        top: 18,
        left: 10,
        width: 35,
        height: 35,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        paddingStart: 1,
        paddingTop: 2,
    },
    imgProfil: {
        top: 10,
        marginLeft: 20,
        // width: 45,
        // height: 45,
        position: 'absolute',
        // backgroundColor: '#EDEEF0',
        left: 50,
    },
    name: {
        paddingTop: 2,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        // backgroundColor: 'yellow',
    },
    type: {
        paddingTop: 3,
        fontSize: 14,
        color: 'grey',
        // backgroundColor: 'red',

    },
    messagesList: {
        flex: 1,
        backgroundColor: '#EDEEF0',
        paddingHorizontal: 5,
    },
    messageSendItem: {
        padding: 10,
        marginVertical: 5,
        marginEnd: 5,
        alignSelf: 'flex-end',
        backgroundColor: '#FDFDFD', // Une couleur de fond pour que les messages soient visibles
        flexDirection: 'row', // 
        maxWidth: '70%',
        borderRadius: 10,
        borderTopEndRadius: 0,

        // #f9fafb
    },
    messageSend: {
        fontSize: 16, // Assurez-vous que la taille de la police est suffisante pour être lue
        color: 'black', // Assurez-vous que la couleur du texte contraste avec l'arrière-plan
    },
    messageReceiveItem: {
        padding: 10,
        marginVertical: 5,
        marginStart: 5,
        alignSelf: 'flex-start',
        backgroundColor: '#3F89F8', // Une couleur de fond pour que les messages soient visibles
        flexDirection: 'row', // 
        maxWidth: '70%',
        borderRadius: 10,
        borderTopStartRadius: 0,
    },
    messageReceive: {
        fontSize: 16, // Assurez-vous que la taille de la police est suffisante pour être lue
        color: 'white',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#FDFDFD',
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    keybord: {
        flex: 1,
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
        backgroundColor: '#3F89F8',
        borderRadius: 20,
    },
    sendButtonText: {
        color: 'white',
    },
});

export default Talk;
