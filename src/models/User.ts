import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  name: string;
  email: string;
  bio?: string;
  friends: mongoose.Types.ObjectId[];
  friendRequests: {
    from: mongoose.Types.ObjectId;
    status: 'pending' | 'accepted' | 'rejected';
  }[];
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  firebaseUid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{
    from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'rejected'],
      required: true 
    }
  }],
  username: { type: String, required: true, unique: true },
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', userSchema); 