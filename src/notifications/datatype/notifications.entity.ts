import { Document, Schema, model } from 'mongoose';

export interface Notification {
  userId: { type: Schema.Types.ObjectId; ref: 'User' } | string;
  body: string;
  postId?: { type: Schema.Types.ObjectId; ref: 'Post' } | string;
  createdAt?: Date;
}

export interface NotificationEntity extends Notification, Document {}

export const NotificationSchema = new Schema<Notification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  body: { type: String, required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: false },
  createdAt: { type: Date, default: Date.now, required: false },
});

export const NotificationModel = model<Notification>(
  'Notification',
  NotificationSchema,
);
