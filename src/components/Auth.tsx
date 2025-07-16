import { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Heading,
  Stack,
  FormControl as ChakraFormControl,
  FormLabel as ChakraFormLabel,
  useToast,
} from '@chakra-ui/react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { createProfile } from '../services/api';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
// ...existing imports

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const toast = useToast();
  const auth = getAuth();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Success',
        description: 'Logged in with Google',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: 'Success',
          description: 'Logged in successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Create user profile in our backend
        await createProfile({
          name,
          email,
        });
        toast({
          title: 'Success',
          description: 'Account created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <Heading mb={6} textAlign="center">
        {isLogin ? 'Login' : 'Sign Up'}
      </Heading>
      <Box p={6} borderWidth="1px" borderRadius="lg" bg="white">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            {!isLogin && (
              <ChakraFormControl isRequired>
                <ChakraFormLabel>Name</ChakraFormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </ChakraFormControl>
            )}
            <ChakraFormControl isRequired>
              <ChakraFormLabel>Email</ChakraFormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </ChakraFormControl>
            <ChakraFormControl isRequired>
              <ChakraFormLabel>Password</ChakraFormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />

            </ChakraFormControl>
            // In your return JSX, add this button:
           <Button
            colorScheme="red"
            width="full"
            onClick={handleGoogleSignIn}
            mt={2}
            >
            Sign in with Google
            </Button>
            <Button type="submit" colorScheme="blue" width="full">
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
            <Stack pt={2}>
              <Text textAlign="center">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Button
                  variant="link"
                  colorScheme="blue"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </Button>
              </Text>
            </Stack>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}; 