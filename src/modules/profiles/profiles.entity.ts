import { Schema, Document, model } from 'mongoose';

export interface Profile extends Document {
  name: string;
  birthday: Date;
  age: number;
  description: string;
  userId: { type: Schema.Types.ObjectId; ref: 'User' };
}

export const ProfileSchema = new Schema<Profile>({
  name: { type: String, required: true },
  birthday: { type: Date, required: true },
  age: { type: Number, required: true },
  description: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export const ProfileModel = model<Profile>('Profile', ProfileSchema);