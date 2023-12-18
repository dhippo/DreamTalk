import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Contacts from "./Contacts";
import NewContact from "./NewContact";
import ContactInfos from "./ContactInfos";
import EditContact from "./EditContact";



const Stack = createNativeStackNavigator();

const ContactsStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ContactsList" component={Contacts} />
            <Stack.Screen name="NewContact" component={NewContact} />
            <Stack.Screen name="ContactInfos" component={ContactInfos} />
            <Stack.Screen name="EditContact" component={EditContact} />

        </Stack.Navigator>
    );
};

export default ContactsStack;
