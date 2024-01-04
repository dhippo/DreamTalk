import React, {useState} from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';



const WelcomeScreen1 = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const openModal = () => {
        if (modalVisible === false) {
            setModalVisible(true);
        }else {
            setModalVisible(false);
        }
    };

    function closeModal() {
        setModalVisible(false);
    }


        function loginModal() {
            setModalVisible(false);
            navigation.navigate('Login');
        }

        function registerModal() {
            setModalVisible(false);
            navigation.navigate('Register');
        }

return (
        <View style={styles.container}>

            <View>
                <View style={styles.bgWrapper}>
                    <Text style={styles.textConnect}>
                        connect your
                    </Text>
                    <Text style={styles.textConnect}>
                        imagination
                    </Text>
                </View>
                <LinearGradient
                    colors={['#f414db', '#2a44ff']}
                    style={styles.gradient}
                >
                    <Text style={styles.transparentText}>
                        .
                    </Text>

                </LinearGradient>

                <View style={styles.dreamTitle}>
                    <Text style={styles.title}>DREAM</Text>
                </View>

                <View style={styles.talkTitle}>
                    <Text style={styles.title}>TALK</Text>
                </View>
            </View>

            <View style={styles.descriptionContainer}>


                <Text style={styles.description}>
                    Découvrez un écosystème avec vos héros

                    préférés interconnectés dans une seule

                    application. Construisez votre univers

                    conversationnel personnalisé !
                </Text>
            </View>

            <View style={styles.socialMediaContainer}>
                <Text style={styles.footerLink}>Twitter</Text>
                <Text style={styles.footerLink}>Facebook</Text>
                <Text style={styles.footerLink}>GitHub</Text>
                <LinearGradient
                    colors={['#f414db', '#2a44ff']}
                    style={styles.actionButton}
                >
                    <TouchableOpacity style={styles.actionButton} onPress={openModal}>
                        <Text style={styles.textactionButton}>👋</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>



            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal} // pour android, bouton retour
            >
                <View style={styles.centeredView}>
                    <LinearGradient
                        colors={['#f414db', '#2a44ff']}
                        style={styles.modalBackground}
                    >
                        <View style={styles.modalView}>
                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={() => loginModal()}
                            >
                                <Text style={styles.textAuthStyle}>se connecter</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.registerButton}
                                onPress={() => registerModal()}
                            >
                                <Text style={styles.textAuthStyle}>s'inscrire</Text>
                            </TouchableOpacity>

                            {/* Bouton pour fermer le modal */}
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={closeModal}
                            >
                                <Text style={styles.textStyle}>fermer</Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>
            </Modal>





        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'space-between',
        padding: 20,
    },
    gradient: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    transparentText: {
        fontSize: 20,
        width: '50%',
        color: 'transparent',
        fontWeight: 'bold',
        textShadowColor: '#000',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    bgWrapper: {
        position: 'relative',
        alignSelf: 'flex-start',
        background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%);',
        borderRadius: 10,
        padding: 6,
    },
    dreamTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
    },
    talkTitle: {
        display: 'flex',
        flexDirection: 'col',
        alignItems: 'flex-end',
        marginRight: 2,
    },
    textConnect: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 58,
        fontWeight: '900',
        textAlign: 'center',
    },
    descriptionContainer: {
        textAlign: 'center',
        marginTop: 20,
    },
    description: {
        marginTop: 3,
        fontSize: 20,
    },
    socialMediaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    footerLink: {
        fontSize: 14,
        color: '#000',
        padding: 10,
    },
    actionButton: {
        fontSize: 16,
        width: 60,
        height: 60,
        borderRadius: 25,

        justifyContent: 'center',
        alignItems: 'center',
    },
    textactionButton: {
        fontSize: 42,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)" // Fond semi-transparent
    },
    modalBackground: {
        width: '80%', // Ajustez la taille selon vos préférences
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalView: {
        width: '100%',
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
    },
    loginButton: {
        width: '80%',
        backgroundColor: "#000",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    registerButton: {
        width: '80%',
        backgroundColor: "#000",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 5,
    },
    closeButton: {
        marginTop: 15,
        backgroundColor: "#2a44ff",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: '100%'
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    textAuthStyle: {
        color: '#ffffff',
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,

    }
});



export default WelcomeScreen1;
