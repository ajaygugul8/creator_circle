import React from 'react';
import { Box, Flex, Button, Link as ChakraLink, Spacer, Heading } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

export const NavBar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate('/');
  };

  return (
    <Box bg="gray.100" px={4} py={2} mb={4} boxShadow="sm">
      <Flex align="center">
        <Heading size="md" mr={8} as={Link} to="/">
          Social App
        </Heading>
        <ChakraLink as={Link} to="/" mr={4} fontWeight="bold">
          Profile
        </ChakraLink>
        <ChakraLink as={Link} to="/users" mr={4} fontWeight="bold">
          All Users
        </ChakraLink>
        <ChakraLink as={Link} to="/suggestions" mr={4} fontWeight="bold">
          Friend Suggestions
        </ChakraLink>
        <ChakraLink as={Link} to="/requests" mr={4} fontWeight="bold">
          Friend Requests
        </ChakraLink>
        <ChakraLink as={Link} to="/friends" mr={4} fontWeight="bold">
          Friends List
        </ChakraLink>
        <Spacer />
        <Button colorScheme="red" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </Flex>
    </Box>
  );
}; 