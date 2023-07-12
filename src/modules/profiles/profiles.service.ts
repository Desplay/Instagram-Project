import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from './profiles.entity';

@Injectable()
export class ProfilesService {
  constructor(@InjectModel('Profile') private readonly ProfileModel: Model<Profile>) {}

  async createProfile(profileInput: Profile): Promise<Profile | undefined> {
    const newProfile = new this.ProfileModel(profileInput);
    return await newProfile.save();
  }

  async findProfile(id: string): Promise<Profile | undefined> {
    return await this.ProfileModel.findOne({ userId: id }).exec();
  }

  async updateProfile(profileInput: Profile): Promise<Profile | undefined> {
    const profile = {
      name: profileInput.name,
      birthday: profileInput.birthday,
      age: profileInput.age,
      description: profileInput.description,
    };
    return await this.ProfileModel.findOneAndUpdate({ userId: profileInput.userId }, profile).exec();
  }

  async deleteProfile(id: string): Promise<Profile | undefined> {
    return await this.ProfileModel.findOneAndDelete({ userId: id }).exec();
  }
}
