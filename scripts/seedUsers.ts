import mongoose from 'mongoose';
import { User } from '../src/models/User';
import dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../.env' });

const users = [
  {
    firebaseUid: 'uid1',
    username: 'alice',
    name: 'Alice',
    email: 'alice@example.com',
    bio: 'Loves hiking',
    friends: [],
    friendRequests: [],
  },
  {
    firebaseUid: 'uid2',
    username: 'bob',
    name: 'Bob',
    email: 'bob@example.com',
    bio: 'Coffee enthusiast',
    friends: [],
    friendRequests: [],
  },
  {
    firebaseUid: 'uid3',
    username: 'charlie',
    name: 'Charlie',
    email: 'charlie@example.com',
    bio: 'Gamer',
    friends: [],
    friendRequests: [],
  },
  {
    firebaseUid: 'uid4',
    username: 'diana',
    name: 'Diana',
    email: 'diana@example.com',
    bio: 'Bookworm',
    friends: [],
    friendRequests: [],
  },
  {
    firebaseUid: 'uid5',
    username: 'eve',
    name: 'Eve',
    email: 'eve@example.com',
    bio: 'Music lover',
    friends: [],
    friendRequests: [],
  },
];

async function seed() {
  try {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not set');
    await mongoose.connect(process.env.MONGODB_URI);
    await User.insertMany(users);
    console.log('Seeded users successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding users:', err);
    process.exit(1);
  }
}

seed(); 