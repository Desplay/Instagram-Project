import { Schema, Document, model } from 'mongoose';

export interface Post {
  title: string;
  content: string;
  imageUrl: string;
  userId: { type: Schema.Types.ObjectId; ref: 'User' } | string;
}
export interface PostEntity extends Post, Document {}

export const PostSchema = new Schema<Post>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, nullable: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export const PostModel = model<Post>('Post', PostSchema);
