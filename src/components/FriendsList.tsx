import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Heading,
  Spinner,
  HStack,
} from '@chakra-ui/react';
import { listFriends } from '../services/api';

interface Friend {
  _id: string;
  name: string;
  email: string;
  bio?: string;
}

export const FriendsList = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    setLoading(true);
    try {
      const data = await listFriends();
      setFriends(data);
    } catch (error: any) {
      // Optionally show a toast
    }
    setLoading(false);
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <Heading mb={6} textAlign="center">My Friends</Heading>
      <VStack spacing={4} align="stretch">
        {friends.length === 0 && <Text>No friends yet.</Text>}
        {friends.map((friend) => (
          <Box key={friend._id} p={4} borderWidth="1px" borderRadius="lg" bg="white">
            <HStack justify="space-between">
              <Box>
                <Text><strong>Name:</strong> {friend.name}</Text>
                <Text><strong>Email:</strong> {friend.email}</Text>
                <Text><strong>Bio:</strong> {friend.bio || 'No bio yet'}</Text>
              </Box>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}; 