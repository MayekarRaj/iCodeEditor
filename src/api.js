import axios from "axios"

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston"
})

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

export const executeCode = async (language, sourceCode, userInput = '') => {
    try {
        const runtimes = await getRuntimes();
        
        const runtime = runtimes.find(lang => 
            lang.language.toLowerCase() === language.toLowerCase() ||
            (lang.aliases && lang.aliases.some(alias => alias.toLowerCase() === language.toLowerCase()))
        );

        if (!runtime) {
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
            ],
            "stdin": userInput // Pass user input as stdin for the execution
        });

        return response.data;
    } catch (error) {
        console.error("Error executing code:", error);
        throw error;
    }
};
