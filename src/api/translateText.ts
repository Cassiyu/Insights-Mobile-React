import axios from 'axios';

const AZURE_TRANSLATION_KEY = '450d8a6e23b049908c715d0013404280'; // Substitua com sua chave
const AZURE_TRANSLATION_ENDPOINT = 'https://api-translato-rm551491.cognitiveservices.azure.com/translator/text/v3.0/translate';

const translateText = async (text: string, toLanguage: string = 'en'): Promise<string> => {
    const url = `${AZURE_TRANSLATION_ENDPOINT}?api-version=3.0&to=${toLanguage}`;
    
    try {
        const response = await axios.post(
            url,
            [{ Text: text }],
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': AZURE_TRANSLATION_KEY,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data[0].translations[0].text;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Translation Error:', error.response ? error.response.data : error.message);
        } else {
            console.error('Translation Error:', error);
        }
        return text;
    }
};

export default translateText;
