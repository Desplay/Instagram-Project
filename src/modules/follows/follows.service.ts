import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Follow } from 'src/common/entity/follow.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class FollowsService {
  constructor(@InjectModel('Follow') private readonly FollowModel: Model<Follow>, private readonly userService: UsersService) {}

  async createFollowUser(user_id: string, user_follow: string): Promise<Follow | undefined> {
    const user_not_found = !(await this.userService.findOneUser(user_id)) && !(await this.userService.findOneUser(user_follow));
    if (user_not_found) throw new Error('User not found');
    const follow = await this.FollowModel.findOne({ userID: user_id });
    if (!follow) {
      const newFollow = new this.FollowModel({ userID: user_id, followingId: [user_follow] });
      return await newFollow.save();
    }
    follow.followingId.push(user_follow);
    return await follow.save();
  }
}
