import { Schema, Document, model } from 'mongoose';

export interface User extends Document {
  username: string;
  email: string;
  password: string;
}

export const UserSchema = new Schema<User>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
});

export const UserModel = model<User>('User', UserSchema);
