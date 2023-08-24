import { Document, Schema, model } from 'mongoose';

export interface Comment {
  reCommentId?: { type: Schema.Types.ObjectId; ref: 'Comment' } | string;
  postId: { type: Schema.Types.ObjectId; ref: 'Post' } | string;
  userId: { type: Schema.Types.ObjectId; ref: 'User' } | string;
  body: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommentEntity extends Comment, Document {}

export const CommentSchema = new Schema<Comment>({
  reCommentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: false },
  updatedAt: { type: Date, required: false },
});

export const CommentModel = model<Comment>('Comment', CommentSchema);
