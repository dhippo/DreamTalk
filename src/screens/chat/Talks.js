
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { chatWithOpenAi } from '../../../api';

const Talks = () => {
    const [userInput, setUserInput] = useState('');
    const [response, setResponse] = useState('');

    const handleSend = async () => {
        const preprompt = "Réponds comme si tu étais Superman: ";
        const fullMessage = preprompt + userInput;
        const aiResponse = await chatWithOpenAi(fullMessage);
        setResponse(aiResponse);
    };

    return (
        <View>
            <TextInput
                placeholder="Posez votre question à Superman..."
                value={userInput}
                onChangeText={setUserInput}
            />
            <Button title="Envoyer" onPress={handleSend} />
            <Text>Réponse de Superman: {response}</Text>

        </View>
    );
};

export default Talks;