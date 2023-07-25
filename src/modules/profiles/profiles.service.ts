import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from '../../common/entity/profile.entity';

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

  async findAllProfileByName(name: string): Promise<Profile[] | undefined> {
    const profiles = await this.ProfileModel.find().where('name').equals(name).exec();
    if (profiles.length > 0) return profiles;
    return undefined;
  }

  async updateProfile(user_id: string, profileInput: any): Promise<Profile | undefined> {
    const newProfile = {
      name: profileInput.name,
      birthday: profileInput.birthday,
      age: profileInput.age,
      description: profileInput.description,
    };
    return await this.ProfileModel.findOneAndUpdate({ userId: user_id }, newProfile).exec();
  }

  async deleteProfile(id: string): Promise<Profile | undefined> {
    return await this.ProfileModel.findOneAndDelete({ userId: id }).exec();
  }
}
