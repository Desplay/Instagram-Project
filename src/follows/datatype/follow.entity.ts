import { Document, Schema, model } from 'mongoose';

export interface Follow {
  userId: { type: Schema.Types.ObjectId; ref: 'User' };
  followingByUserId: { type: Schema.Types.ObjectId; ref: 'User' };
  followAt: Date;
}
export interface FollowEntity extends Follow, Document {}

export const FollowSchema = new Schema<Follow>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  followingByUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  followAt: { type: Date, default: Date.now },
});

export const FollowModel = model<Follow>('Follow', FollowSchema);
