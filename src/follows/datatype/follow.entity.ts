import { Document, Schema, model } from 'mongoose';

export interface Follow {
  userID: string;
  followingId: string;
  followAt: Date;
}
export interface FollowEntity extends Follow, Document {}

export const FollowSchema = new Schema<Follow>({
  userID: { type: String, required: true },
  followingId: { type: String, required: true },
  followAt: { type: Date, default: Date.now },
});

export const FollowModel = model<Follow>('Follow', FollowSchema);
