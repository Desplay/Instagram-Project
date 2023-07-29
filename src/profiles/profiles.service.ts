import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileEntity } from './datatype/profile.entity';
import { ProfileInput } from './datatype/profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel('Profile')
    private readonly ProfileModel: Model<ProfileEntity>,
  ) {}

  async createProfile(
    profileInput: Profile,
    user_id: string,
  ): Promise<boolean> {
    const newProfile = new this.ProfileModel({
      ...profileInput,
      userId: user_id,
    }).save();
    return newProfile ? true : false;
  }

  async findProfile(id: string): Promise<Profile> {
    return await this.ProfileModel.findOne({ userId: id });
  }

  async findAllProfileByName(profileName: string): Promise<Profile[]> {
    const profiles = await this.ProfileModel.find()
      .where('name')
      .equals(profileName);
    return profiles.length > 0 ? profiles : undefined;
  }

  async updateProfile(
    user_id: string,
    profileInput: ProfileInput,
  ): Promise<boolean> {
    const update_profile_done = await this.ProfileModel.findOneAndUpdate(
      { userId: user_id },
      profileInput,
    );
    return update_profile_done ? true : false;
  }

  filterProfile(profiles: Profile[], statusInput: boolean[]): Profile[] {
    const filter_profiles = profiles.filter((profile, index) =>
      !statusInput[index] === true ? profile : undefined,
    );
    return filter_profiles.length > 0 ? filter_profiles : undefined;
  }

  async deleteProfile(id: string): Promise<boolean> {
    const profile = await this.ProfileModel.findOneAndRemove({ _id: id });
    return profile ? true : false;
  }
}
