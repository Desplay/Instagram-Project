import { Document, Schema, model } from 'mongoose';

export interface Follow extends Document {
  userID: string;
  followingId: string[];
}

export const FollowSchema = new Schema<Follow>({
  userID: { type: String, required: true },
  followingId: { type: [String], required: true },
});

export const FollowModel = model<Follow>('Follow', FollowSchema);
