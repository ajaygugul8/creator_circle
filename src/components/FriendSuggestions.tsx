import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  VStack,
  Text,
  Heading,
  useToast,
  HStack,
  Spinner,
} from '@chakra-ui/react';
import { getFriendSuggestions, sendFriendRequest } from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
}

export const FriendSuggestions = () => {
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const data = await getFriendSuggestions();
      setSuggestions(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const handleSendRequest = async (userId: string) => {
    setSending(userId);
    try {
      await sendFriendRequest(userId);
      toast({
        title: 'Request Sent',
        description: 'Friend request sent successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Optionally refresh suggestions
      await loadSuggestions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setSending(null);
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <Heading mb={6} textAlign="center">Friend Suggestions</Heading>
      <VStack spacing={4} align="stretch">
        {suggestions.length === 0 && <Text>No suggestions found.</Text>}
        {suggestions.map((user) => (
          <Box key={user._id} p={4} borderWidth="1px" borderRadius="lg" bg="white">
            <HStack justify="space-between">
              <Box>
                <Text><strong>Name:</strong> {user.name}</Text>
                <Text><strong>Email:</strong> {user.email}</Text>
                <Text><strong>Bio:</strong> {user.bio || 'No bio yet'}</Text>
              </Box>
              <Button
                colorScheme="blue"
                onClick={() => handleSendRequest(user._id)}
                isLoading={sending === user._id}
              >
                Add Friend
              </Button>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}; 