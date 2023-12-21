import { OPENAI_API_KEY } from "@env";
import axios from 'axios';

const openAiApiKey = OPENAI_API_KEY;

const openAiApi = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        'Authorization': `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json'
    }
});

export const chatWithOpenAi = async (message) => {
    try {
        const response = await openAiApi.post('/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
            temperature: 0.1
        });
        
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Erreur lors de la communication avec OpenAI:', error);
        return '';
    }
};

export const verifName = async (message) => {
    try {
        const response = await openAiApi.post('/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
            temperature: 0.5,
            max_tokens: 100
        });
        
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Erreur lors de la communication avec OpenAI:', error);
        return '';
    }
};