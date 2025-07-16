import { useEffect, useState } from 'react';
import { Box, Container, Spinner, Center } from '@chakra-ui/react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { Auth } from './components/Auth';
import { Profile } from './components/Profile';
import { UsersList } from './components/UsersList';
import { NavBar } from './components/NavBar';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FriendSuggestions } from './components/FriendSuggestions';
import { FriendRequests } from './components/FriendRequests';
import { FriendsList } from './components/FriendsList';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Router>
      {user && <NavBar />}
      <Container maxW="container.md" py={8}>
        <Routes>
          {!user ? (
            <Route path="*" element={<Auth />} />
          ) : (
            <>
              <Route path="/" element={<Profile />} />
              <Route path="/users" element={<UsersList />} />
              <Route path="/suggestions" element={<FriendSuggestions />} />
              <Route path="/requests" element={<FriendRequests />} />
              <Route path="/friends" element={<FriendsList />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
