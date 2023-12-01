import {ImageBackground, StyleSheet, Text, View} from 'react-native';

const backgroung_image = require('./../../assets/background/fondHeros.jpeg');

const Vitrine1 = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <ImageBackground source={backgroung_image} style={styles.image}>
                <View style={styles.presentation1}>
                    <Text style={styles.text}>Bienvenue sur DreamTalk, un chatbot qui vous permet de discter avec vos personnages préféréé</Text>
                </View>
            </ImageBackground>
        </View>
    );

}

const styles = StyleSheet.create({ 

    image: {
        resizeMode: "cover",
        justifyContent: "center",
        width: '100%',
        height: '100%',

    },
    presentation1: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: 'Cochin',
    }

});

export default Vitrine1;