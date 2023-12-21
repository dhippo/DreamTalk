import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Talks from "./Talks";
import NewTalk from "./NewTalk";
import Chat from "./Chat";

import NewAgent from "./NewAgent";
import FriendChat from "./FriendChat";
import NewFriendChat from "./NewFriendChat";


const Stack = createNativeStackNavigator();

const ChatStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Talks" component={Talks} />
            <Stack.Screen name="NewTalk" component={NewTalk} />
            <Stack.Screen name="Chat" component={Chat} />

            <Stack.Screen name="NewAgent" component={NewAgent} />
            <Stack.Screen name="FriendChat" component={FriendChat} />

            <Stack.Screen name="NewFriendChat" component={NewFriendChat} />


        </Stack.Navigator>
    );
};

export default ChatStack;
