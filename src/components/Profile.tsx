import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  useToast,
  Heading,
  Stack,
  FormControl as ChakraFormControl,
  FormLabel as ChakraFormLabel,
} from '@chakra-ui/react';
import { getProfile, updateProfile, createProfile } from '../services/api';
import { getAuth } from 'firebase/auth';

interface Profile {
  name: string;
  email: string;
  bio?: string;
}

export const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
  });
  const [showCreate, setShowCreate] = useState(false);
  const toast = useToast();
  const auth = getAuth();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      setFormData({
        name: data.name,
        bio: data.bio || '',
      });
      setShowCreate(false);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setShowCreate(true);
      } else {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      await loadProfile();
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
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

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error('No authenticated user or email');
      const username = formData.name.toLowerCase().replace(/\s+/g, '');
      await createProfile({ name: formData.name, email: user.email, username });
      toast({
        title: 'Profile created',
        description: 'Your profile has been created.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setShowCreate(false);
      await loadProfile();
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

  if (showCreate) {
    return (
      <Box maxW="md" mx="auto" mt={8}>
        <Heading mb={6} textAlign="center">Create Your Profile</Heading>
        <Box p={6} borderWidth="1px" borderRadius="lg" bg="white">
          <form onSubmit={handleCreateProfile}>
            <VStack spacing={4}>
              <ChakraFormControl isRequired>
                <ChakraFormLabel>Name</ChakraFormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                />
              </ChakraFormControl>
              <Button type="submit" colorScheme="blue" width="full">
                Create Profile
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
    );
  }

  if (!profile) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box maxW="md" mx="auto" mt={8}>
      <Heading mb={6} textAlign="center">Profile</Heading>
      {!isEditing ? (
        <VStack spacing={4} align="stretch">
          <Box p={4} borderWidth="1px" borderRadius="lg">
            <Stack spacing={3}>
              <Text>
                <strong>Name:</strong> {profile.name}
              </Text>
              <Text>
                <strong>Email:</strong> {profile.email}
              </Text>
              <Text>
                <strong>Bio:</strong> {profile.bio || 'No bio yet'}
              </Text>
            </Stack>
          </Box>
          <Button onClick={() => setIsEditing(true)} colorScheme="blue">
            Edit Profile
          </Button>
        </VStack>
      ) : (
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <ChakraFormControl>
              <ChakraFormLabel>Name</ChakraFormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
              />
            </ChakraFormControl>
            <ChakraFormControl>
              <ChakraFormLabel>Bio</ChakraFormLabel>
              <Input
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself"
              />
            </ChakraFormControl>
            <Button type="submit" colorScheme="blue" width="full">
              Save Changes
            </Button>
            <Button 
              onClick={() => setIsEditing(false)} 
              variant="outline"
              width="full"
            >
              Cancel
            </Button>
          </VStack>
        </form>
      )}
    </Box>
  );
}; 