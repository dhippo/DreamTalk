import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Talks from '../screens/chat/Talks';
import InfoProfil from '../screens/profil/InfoProfil';
import { MaterialIcons } from '@expo/vector-icons';
import ContactsStack from "../screens/contact/ContactsStack";
import ProfileStack from "../screens/profil/ProfileStack";
import ChatStack from "../screens/chat/ChatStack";

const Tab = createBottomTabNavigator();

export default function Navigation() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color }) => {
                    let iconName;
                    let size = 34; // Taille pour augmenter pour les icônes

                    if (route.name === 'Contacts') {
                        iconName = focused ? 'contacts' : 'contacts';
                    } else if (route.name === 'Discussions') {
                        iconName = focused ? 'chat' : 'chat';
                    } else if (route.name === 'Profil') {
                        iconName = focused ? 'person' : 'person';
                    }

                    return <MaterialIcons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: {
                    fontSize: 16, // Taille du texte des onglets (en dessous des icônes)
                    marginBottom: 7,
                    marginTop : -5,
                },
                tabBarStyle: {
                     height: 80, // Hauteur personnalisée de la barre de navigation
                },
            })}
        >
            <Tab.Screen name="Contacts" component={ContactsStack} />
            <Tab.Screen name="Discussions" component={ChatStack} />
            <Tab.Screen name="Profil" component={ProfileStack} />

        </Tab.Navigator>
    );
}
