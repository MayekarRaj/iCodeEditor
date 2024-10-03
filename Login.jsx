import React from 'react';
import { Button, Box, useToast } from '@chakra-ui/react';
import { auth, googleProvider, signInWithPopup, signOut } from '../firebaseConfig'; // Correct import path

const Login = () => {
  const toast = useToast(); // Chakra UI's toast for notifications

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('User signed in:', result.user);
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup before completing the sign-in
        toast({
          title: 'Popup closed',
          description: 'You closed the sign-in popup before logging in.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Handle other errors
        toast({
          title: 'Sign-in error',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        console.error('Error during sign in:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
    } catch (error) {
      toast({
        title: 'Logout error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error during sign out:', error);
    }
  };

  return (
    <Box
      position="fixed"
      top="20px"
      right="20px"
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <Button onClick={handleLogin} colorScheme="blue">
        Login with Google
      </Button>
      <Button onClick={handleLogout} colorScheme="red">
        Logout
      </Button>
    </Box>
  );
};

export default Login;
