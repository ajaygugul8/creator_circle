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
import { getProfile, handleFriendRequest } from '../services/api';

interface FriendRequest {
  _id: string;
  from: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
}

export const FriendRequests = () => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const profile = await getProfile();
      setRequests(
        (profile.friendRequests || []).filter((r: FriendRequest) => r.status === 'pending')
      );
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

  const handleAction = async (requestId: string, action: 'accept' | 'reject') => {
    setProcessing(requestId);
    try {
      await handleFriendRequest(requestId, action);
      toast({
        title: `Request ${action}ed`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      await loadRequests();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setProcessing(null);
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <Heading mb={6} textAlign="center">Friend Requests</Heading>
      <VStack spacing={4} align="stretch">
        {requests.length === 0 && <Text>No pending friend requests.</Text>}
        {requests.map((req) => (
          <Box key={req._id} p={4} borderWidth="1px" borderRadius="lg" bg="white">
            <HStack justify="space-between">
              <Box>
                <Text><strong>Name:</strong> {req.from.name}</Text>
                <Text><strong>Email:</strong> {req.from.email}</Text>
              </Box>
              <HStack>
                <Button
                  colorScheme="green"
                  size="sm"
                  onClick={() => handleAction(req.from._id, 'accept')}
                  isLoading={processing === req._id}
                >
                  Accept
                </Button>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleAction(req.from._id, 'reject')}
                  isLoading={processing === req._id}
                >
                  Reject
                </Button>
              </HStack>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}; 