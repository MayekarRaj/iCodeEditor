import axios from "axios"

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston"
})

// Auth helper: posts credentials to an auth endpoint.
// Configure the endpoint using Vite env variable VITE_AUTH_URL or it will default to /api/auth/login
export const login = async (email, password) => {
    const url = import.meta.env.VITE_AUTH_URL || "/api/auth/login";
    const response = await axios.post(url, { email, password });
    return response.data;
}

export const getRuntimes = async () => {
    const desiredLanguages = ['js', 'python', 'c++', 'java', 'go'];

    const response = await API.get("/runtimes");
    const filteredLanguages = response.data.filter((lang) => 
        desiredLanguages.includes(lang.language.toLowerCase()) 
      ||
        (lang.aliases && lang.aliases.some(alias => desiredLanguages.includes(alias.toLowerCase())))
    );
    return filteredLanguages;
}

export const executeCode = async (language, sourceCode) => {
    try {
        const runtimes = await getRuntimes();
        
        const runtime = runtimes.find(lang => 
            lang.language.toLowerCase() === language.toLowerCase() ||
            (lang.aliases && lang.aliases.some(alias => alias.toLowerCase() === language.toLowerCase()))
        );

        if (!runtime) {
            // throw new Error(`Runtime for language ${language} not found.`);
            alert(`Runtime for language ${language} not found.`);
        }

        const response = await API.post("/execute", {
            "language": language,
            "version": runtime.version,
            "files": [
                {
                    "name": "code",
                    "content": sourceCode
                }
            ]
        });

        return response.data;
    } catch (error) {
        console.error("Error executing code:", error);
        throw error;
    }
};