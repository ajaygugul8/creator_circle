import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  listUsers,
  getFriendSuggestions,
  sendFriendRequest,
  handleFriendRequest,
  listFriends,
} from '../controllers/userController';

const router = express.Router();

// Public routes
router.post('/profile', authenticate, createUserProfile);

// Protected routes
router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);
router.get('/list', authenticate, listUsers);
router.get('/suggestions', authenticate, getFriendSuggestions);
router.post('/friend-request', authenticate, sendFriendRequest);
router.put('/friend-request', authenticate, handleFriendRequest);
router.get('/friends', authenticate, listFriends);

export default router; 