import { Box, Button, Text, useToast, VStack, HStack, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { RepeatIcon } from "@chakra-ui/icons";
import { executeCode } from "../api";

// eslint-disable-next-line react/prop-types
const Output = ({ editorRef, language }) => {
  const toast = useToast();
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    // eslint-disable-next-line react/prop-types
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) {
      toast({
        title: "No code found!",
        description: "Please write some code before running.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output ? result.output.split("\n") : ["No output"]);
      setIsError(!!result.stderr);
    } catch (error) {
      console.error(error);
      toast({
        title: "Execution Error",
        description: error.message || "Unable to run code",
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const clearOutput = () => {
    setOutput(null);
    setIsError(false);
    toast({
      title: "Output cleared",
      status: "info",
      duration: 1500,
      isClosable: true,
    });
  };

  return (
    <VStack
      w="100%"
      align="stretch"
      spacing={3}
      bg="gray.900"
      borderRadius="md"
      p={4}
      color="gray.100"
      border="1px solid"
      borderColor="gray.700"
      boxShadow="md"
      transition="all 0.3s ease"
    >
      <HStack justify="space-between" align="center">
        <Text fontSize="lg" fontWeight="semibold">
          Output
        </Text>

        <HStack spacing={2}>
          <Button
            colorScheme="green"
            onClick={runCode}
            isLoading={loading}
            loadingText="Running"
            size="sm"
          >
            Run Code
          </Button>

          <IconButton
            icon={<RepeatIcon />}
            aria-label="Clear Output"
            size="sm"
            variant="outline"
            onClick={clearOutput}
          />
        </HStack>
      </HStack>

      <Box
        flex="1"
        height={{ base: "40vh", lg: "75vh" }}
        bg={isError ? "rgba(255, 80, 80, 0.05)" : "rgba(255,255,255,0.03)"}
        color={isError ? "red.300" : "gray.100"}
        p={3}
        borderRadius="md"
        border="1px solid"
        borderColor={isError ? "red.400" : "gray.700"}
        overflowY="auto"
        whiteSpace="pre-wrap"
        fontFamily="Fira Code, monospace"
        fontSize="sm"
        sx={{
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            background: "#555",
            borderRadius: "4px",
          },
        }}
      >
        {output ? (
          output.map((line, i) => <Text key={i}>{line}</Text>)
        ) : (
          <Text opacity={0.6}>Click “Run Code” to see output here.</Text>
        )}
      </Box>
    </VStack>
  );
};

export default Output;
