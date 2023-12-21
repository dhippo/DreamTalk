import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { chatWithOpenAi } from '../../../api';

const Talk = () => {
    const [userInput, setUserInput] = useState('');
    const [response, setResponse] = useState('');
    const [isRequesting, setIsRequesting] = useState(false);

    const handleSend = async () => {
        setIsRequesting(true);
        const preprompt = "Réponds comme si tu étais Superman: ";
        const fullMessage = preprompt + userInput;
        
        try {
            const aiResponse = await chatWithOpenAi(fullMessage);
            setResponse(aiResponse);
        } catch (error) {
            if (error.response && error.response.status === 429) {
                setResponse("Trop de demandes - veuillez attendre un moment avant de réessayer.");
            } else {
                setResponse("Une erreur est survenue lors de la communication avec OpenAI.");
            }
        } finally {
            setIsRequesting(false);
        }
    };

    return (
        <View>
            <TextInput
                placeholder="Posez votre question à Superman..."
                value={userInput}
                onChangeText={setUserInput}
                editable={!isRequesting} // Désactive l'édition pendant la requête
            />
            <Button 
                title="Envoyer" 
                onPress={handleSend} 
                disabled={isRequesting} // Désactive le bouton pendant la requête
            />
            <Text>Réponse de Superman: {response}</Text>
        </View>
    );
};

export default Talk;
