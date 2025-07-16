import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User, IUser } from '../models/User';
import mongoose from 'mongoose';

export const createUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, username } = req.body;
    const firebaseUid = req.user?.uid;

    if (!firebaseUid || !name || !email || !username) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ firebaseUid });
    if (existingUser) {
      return res.status(400).json({ message: 'User profile already exists' });
    }

    const user = new User({
      firebaseUid,
      name,
      email,
      username,
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user?.uid })
      .populate('friends', 'name email')
      .populate('friendRequests.from', 'name email');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, bio } = req.body;
    const user = await User.findOne({ firebaseUid: req.user?.uid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listUsers = async (req: AuthRequest, res: Response) => {
  try {
    const currentUser = await User.findOne({ firebaseUid: req.user?.uid });
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const users = await User.find({
      _id: { $ne: currentUser._id },
    }).select('name email bio');

    res.json(users);
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFriendSuggestions = async (req: AuthRequest, res: Response) => {
  try {
    const currentUser = await User.findOne({ firebaseUid: req.user?.uid });
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const users = await User.aggregate([
      { $match: { 
        _id: { 
          $nin: [...(currentUser.friends || []), currentUser._id] 
        }
      }},
      { $sample: { size: 5 } },
      { $project: { name: 1, email: 1, bio: 1 } }
    ]);

    res.json(users);
  } catch (error) {
    console.error('Get friend suggestions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendFriendRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.body;
    const currentUser = await User.findOne({ firebaseUid: req.user?.uid });
    const targetUser = await User.findById(userId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingRequest = targetUser.friendRequests.find(
      request => request.from.toString() === currentUser._id.toString()
    );

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    targetUser.friendRequests.push({
      from: currentUser._id,
      status: 'pending'
    });

    await targetUser.save();
    res.json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const handleFriendRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { requestId, action } = req.body;
    const currentUser = await User.findOne({ firebaseUid: req.user?.uid });
    
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const request = currentUser.friendRequests.find(
      req => req.from.toString() === requestId
    );

    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (action === 'accept') {
      request.status = 'accepted';
      currentUser.friends.push(request.from);
      
      const otherUser = await User.findById(request.from);
      if (otherUser) {
        otherUser.friends.push(currentUser._id);
        await otherUser.save();
      }
    } else if (action === 'reject') {
      request.status = 'rejected';
    }

    await currentUser.save();
    res.json({ message: `Friend request ${action}ed successfully` });
  } catch (error) {
    console.error('Handle friend request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listFriends = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user?.uid })
      .populate('friends', 'name email bio');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.friends);
  } catch (error) {
    console.error('List friends error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 