import axios from 'axios';
import { getAuth } from 'firebase/auth';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export const createProfile = async (data: { name: string; email: string; username: string }) => {
  const response = await api.post('/users/profile', data);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateProfile = async (data: { name?: string; bio?: string }) => {
  const response = await api.put('/users/profile', data);
  return response.data;
};

export const listUsers = async () => {
  const response = await api.get('/users/list');
  return response.data;
};

export const getFriendSuggestions = async () => {
  const response = await api.get('/users/suggestions');
  return response.data;
};

export const sendFriendRequest = async (userId: string) => {
  const response = await api.post('/users/friend-request', { userId });
  return response.data;
};

export const handleFriendRequest = async (requestId: string, action: 'accept' | 'reject') => {
  const response = await api.put('/users/friend-request', { requestId, action });
  return response.data;
};

export const listFriends = async () => {
  const response = await api.get('/users/friends');
  return response.data;
}; 