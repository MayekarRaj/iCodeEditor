// CodeEditor.jsx
import { Box, HStack, useColorModeValue } from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import React, { useRef, useState, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';
import { CODE_SNIPPETS } from '../constants';
import Output from './Output';
import { getRuntimes } from '../api';

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("");
  const [languages, setLanguages] = useState([]);
  
  const editorBackgroundColor = useColorModeValue('white', '#1c2130'); // Monaco Editor background

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const runtime = await getRuntimes();
        setLanguages(runtime);
        setLanguage(runtime[0].language);
        setValue(CODE_SNIPPETS[runtime[0].language]); 
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchLanguages();
  }, []);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  return (
    <Box>
      <HStack spacing={4}>
        <Box w="60%">
          <LanguageSelector language={language} onSelect={onSelect} languages={languages} />
          <Editor
            height="75vh"
            theme={useColorModeValue('light', 'vs-dark')} // Switch theme based on color mode
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            options={{
              fontFamily: "Fira Code, monospaced",
              fontSize: 15,
              fontLigatures: true,
              lineHeight: 22,
              backgroundColor: editorBackgroundColor, // Ensure editor background color changes
            }}
            onChange={(value) => setValue(value)}
          />
        </Box>
        <Output editorRef={editorRef} language={language} />
      </HStack>
    </Box>
  );
};

export default CodeEditor;
