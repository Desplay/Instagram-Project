import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Follow } from 'src/follows/datatype/follow.entity';
import { ProfilesService } from 'src/profiles/profiles.service';

@Injectable()
export class FollowsService {
  constructor(
    @InjectModel('Follow')
    private readonly FollowModel: Model<Follow>,
    private readonly profileService: ProfilesService,
  ) {}

  async createFollowProfile(
    user_id: string,
    profile_follow: string,
  ): Promise<boolean> {
    const user_follow = await this.profileService.throwUserIdFromProfile(
      profile_follow,
    );
    if (!user_follow && user_id === user_follow) return false;
    const check = await this.FollowModel.find()
      .where('userId')
      .equals(user_id)
      .where('followingByUserId')
      .equals(user_follow);
    if (check.length !== 0) return false;
    const follow = new this.FollowModel({
      userId: user_id,
      followingByUserId: user_follow,
    }).save();
    return follow ? true : false;
  }

  async findFollowerInProfileId(user_id: string): Promise<string[]> {
    const follows = await this.FollowModel.find()
      .where('userId')
      .equals(user_id);
    if (follows.length === 0) return undefined;
    const follows_filtered = [];
    for await (const follow of follows) {
      const profile = await this.profileService.findProfile(
        follow.followingByUserId.toString(),
      );
      profile ? follows_filtered.push(profile.id) : undefined;
    }
    return follows_filtered;
  }

  async findFollowingInProfileId(user_id: string): Promise<string[]> {
    const follows = await this.FollowModel.find()
      .where('followingByUserId')
      .equals(user_id);
    if (follows.length === 0) return undefined;
    const follows_filtered = [];
    for await (const follow of follows) {
      const profile = await this.profileService.findProfile(
        follow.userId.toString(),
      );
      profile ? follows_filtered.push(profile.id) : undefined;
    }
    return follows_filtered;
  }

  async deleteFollowProfile(
    user_id: string,
    profile_follow: string,
  ): Promise<boolean> {
    const user_follow = await this.profileService.throwUserIdFromProfile(
      profile_follow,
    );
    if (!user_follow && user_id === user_follow) return false;
    const follow = await this.FollowModel.findOneAndRemove({
      userId: user_id,
      followingByUserId: user_follow,
    });
    return follow ? true : false;
  }
}
