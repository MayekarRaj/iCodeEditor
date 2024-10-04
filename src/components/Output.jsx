import { Box, Button, Text, useToast, useColorModeValue, Input } from '@chakra-ui/react';
import React, { useState } from 'react';
import { executeCode } from '../api';

const Output = ({ editorRef, language }) => {
  const toast = useToast();
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userInput, setUserInput] = useState(''); // To store user input before execution

  const outputBackground = useColorModeValue('white', '#1e1e1e');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue(); // Get code from editor

    if (!sourceCode) return;

    try {
      setLoading(true);
      const { run: result } = await executeCode(language, sourceCode, userInput); // Pass user input

      setOutput(result.output.split("\n"));
      setIsError(!!result.stderr);
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: error.message || 'Unable to run the code',
        status: 'error',
        duration: 6000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box w="40%">
      <Text mb={2} fontSize="lg">Output:</Text>

      <Button
        variant="outline"
        colorScheme="green"
        mb={4}
        onClick={runCode}
        isLoading={loading}
      >
        Run Code
      </Button>

      <Input
        placeholder="Enter input (if required)..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        mb={4}
      />

      

      <Box
        height="67vh"
        p={2}
        bg={outputBackground}
        color={isError ? 'red.500' : textColor}
        border="1px solid"
        borderRadius={4}
        borderColor={isError ? 'red.300' : '#333'}
        overflowY="auto"
      >
        {output ? output.map((line, i) => (
          <Text key={i}>{line}</Text>
        )) : "Click 'Run Code' to see the output"}
      </Box>
    </Box>
  );
};

export default Output;
