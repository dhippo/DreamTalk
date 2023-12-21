import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Talk from "./Talk";
import Talks from './Talks';
import NewTalk from "./NewTalk";
// import TalkInfos from "./TalkInfos";
// import EditTalk from "./EditTalk";


const Stack = createNativeStackNavigator();

const TalksStack = () => {
        
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>

            <Stack.Screen name="Talks" component={Talks} />
            <Stack.Screen name="Talk" component={Talk} />
            <Stack.Screen name="NewTalk" component={NewTalk} />
            {/* <Stack.Screen name="TalkInfos" component={TalkInfos} />
            <Stack.Screen name="EditTalk" component={EditTalk} /> */}

        </Stack.Navigator>
    );
    
}

export default TalksStack;