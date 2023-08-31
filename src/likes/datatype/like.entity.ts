import { Document, Schema, model } from 'mongoose';

export interface Like {
  postId: { type: Schema.Types.ObjectId; ref: 'Post' } | string;
  userIdLiked: { type: Schema.Types.ObjectId; ref: 'User' } | string;
  createdAt?: Date;
}

export interface LikeEntity extends Like, Document {}

export const LikeSchema = new Schema<Like>({
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  userIdLiked: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: { type: Date, default: Date.now, required: false },
});

export const LikeModel = model<Like>('Like', LikeSchema);
