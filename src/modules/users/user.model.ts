// Model for users datanbase

import { Schema, Document, model } from 'mongoose';

export class User extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export const UserModel = model<User>('User', UserSchema);
