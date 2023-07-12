import { Schema, Document, model } from 'mongoose';

export interface User extends Document {
  deactive: boolean;
  username: string;
  email: string;
  password: string;
  OTPCode: {
    verify: boolean;
    code: string;
    dateCreated: number;
    dateExpired: number;
  };
}

export const UserSchema = new Schema<User>({
  deactive: { type: Boolean, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  OTPCode: {
    verify: { type: Boolean, required: true },
    code: { type: String, required: true },
    dateCreated: { type: Number, required: true },
    dateExpired: { type: Number, required: true },
  },
});

export const UserModel = model<User>('User', UserSchema);
