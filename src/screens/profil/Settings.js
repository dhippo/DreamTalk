import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import InfoProfil from "./InfoProfil";

const Settings = ({ route, navigation }) => {


    return (
        <View style={settingsStyles.container}>
            <LinearGradient
                colors={['#f414db', '#2a44ff']}
                style={settingsStyles.gradientHeader}
            >
                <TouchableOpacity style={settingsStyles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={32} color="#ffffff" />
                </TouchableOpacity>
                <Text style={settingsStyles.headerTitle}>Paramètres</Text>
            </LinearGradient>

            <View style={settingsStyles.contentContainer}>
                <Text style={settingsStyles.infoText}>Les paramètres ne sont pas disponibles pour le moment</Text>
            </View>
        </View>
    );
};

const settingsStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    gradientHeader: {
        paddingHorizontal: 10,
        paddingTop: 40,
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
    headerTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: '900',
        textAlign: 'center',
        flexGrow: 1,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    infoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
    },

});

export default Settings;