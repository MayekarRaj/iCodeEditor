import {
  Box,
  HStack,
  IconButton,
  useColorMode,
  useColorModeValue,
  Tooltip,
  VStack,
  Text,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import { CODE_SNIPPETS } from "../constants";
import { getRuntimes } from "../api";

const CodeEditor = () => {
  const editorRef = useRef();
  const { colorMode, toggleColorMode } = useColorMode();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("");
  const [languages, setLanguages] = useState([]);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const runtime = await getRuntimes();
        setLanguages(runtime);
        setLanguage(runtime[0].language);
        setValue(CODE_SNIPPETS[runtime[0].language]);
      } catch (error) {
        console.error("Error fetching runtimes:", error);
      }
    };
    fetchLanguages();
  }, []);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (lang) => {
    setLanguage(lang);
    setValue(CODE_SNIPPETS[lang]);
  };

  return (
    <VStack spacing={4} align="stretch" w="100%" p={4} bg={bgColor} color={textColor}>
      {/* Header Section */}
      <HStack justify="space-between" align="center" mb={2}>
        <Text fontSize="xl" fontWeight="semibold">
          iCodeEditor
        </Text>

        <Tooltip label={`Switch to ${colorMode === "light" ? "Dark" : "Light"} Mode`} hasArrow>
          <IconButton
            aria-label="Toggle theme"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="outline"
            size="sm"
          />
        </Tooltip>
      </HStack>

      {/* Editor + Output Section */}
      <HStack
        spacing={4}
        align="start"
        flexWrap={{ base: "wrap", lg: "nowrap" }}
        justify="space-between"
      >
        {/* Code Editor Section */}
        <Box
          flex="1"
          minW={{ base: "100%", lg: "60%" }}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="md"
          p={3}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow="md"
        >
          <LanguageSelector language={language} onSelect={onSelect} languages={languages} />

          <Editor
            height="75vh"
            theme={colorMode === "light" ? "vs-light" : "vs-dark"}
            language={language}
            value={value}
            onMount={onMount}
            onChange={(v) => setValue(v)}
            options={{
              fontFamily: "Fira Code, monospace",
              fontSize: 15,
              fontLigatures: true,
              minimap: { enabled: false },
              automaticLayout: true,
              smoothScrolling: true,
              scrollBeyondLastLine: false,
            }}
          />
        </Box>

        {/* Output Panel */}
        <Box flex="1" minW={{ base: "100%", lg: "40%" }}>
          <Output editorRef={editorRef} language={language} />
        </Box>
      </HStack>
    </VStack>
  );
};

export default CodeEditor;
