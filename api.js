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

export const chatWithOpenAi = async (messages) => {
    try {
        const response = await openAiApi.post('/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: messages,
            // messages: [{ role: "user", content: message }],
            temperature: 0.7,
            max_tokens: 360
        });
        // afficher le nombre de token de la reponse dans les logs
        // console.log(response.data.choices[0].logprobs.token_logprobs.length);
        let reponse = response.data.choices[0].message.content;
        messages.push({ role: "assistant", content: reponse.trim() });
        return Promise.resolve({success: true, response: reponse.trim()});
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
            temperature: 0.8,
            max_tokens: 60
        });
        
        console.log(response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Erreur lors de la communication avec OpenAI:', error);
        return '';
    }
};