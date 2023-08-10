import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Follow } from 'src/follows/datatype/follow.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class FollowsService {
  constructor(
    @InjectModel('Follow')
    private readonly FollowModel: Model<Follow>,
    private readonly userService: UsersService,
  ) {}

  async createFollowUser(
    user_id: string,
    user_follow: string,
  ): Promise<Follow> {
    const user_not_found =
      !(await this.userService.findOneUser(user_id)) &&
      !(await this.userService.findOneUser(user_follow));
    if (user_not_found) return undefined;
    const follow = new this.FollowModel({
      user_id,
      user_follow,
    });
    return await follow.save();
  }
}
