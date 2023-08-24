import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Profile as ProfileInputEntity,
  ProfileEntity,
} from './datatype/profile.entity';
import { Profile, ProfileInput, Profiles } from './datatype/profile.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel('Profile')
    private readonly ProfileModel: Model<ProfileEntity>,
    private readonly userService: UsersService,
  ) {}

  async createProfile(
    profileInput: ProfileInputEntity,
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

  async findAllProfileByName(profileName: string): Promise<Profiles> {
    const profiles_found = await this.ProfileModel.find()
      .where('name')
      .equals(profileName);
    if (profiles_found.length === 0) return undefined;
    const Profiles_filtered = [];
    for await (const profile of profiles_found) {
      const { userId } = profile;
      const user_exist = await this.userService.findOneUser(
        userId.toString(),
      );
      user_exist.deactive ? undefined : Profiles_filtered.push(profile);
    }
    const Profiles: Profiles = {
      profiles: Profiles_filtered.map((profile) => {
        const { _id, name, age, birthday, description } = profile;
        const id: string = _id.toString();
        return { id, name, age, birthday, description };
      }),
    };
    return Profiles;
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

  async deleteProfile(id: string): Promise<boolean> {
    const profile = await this.ProfileModel.findOneAndRemove({ _id: id });
    return profile ? true : false;
  }

  async throwUserIdFromProfile(id: string): Promise<string> {
    const profile = await this.ProfileModel.findOne({ _id: id });
    return profile ? profile.userId.toString() : undefined;
  }
}
