// Service for users module

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserEntity } from 'src/users/datatype/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly UserModel: Model<UserEntity>,
  ) {}

  async createUser(user: User): Promise<string> {
    const new_user = new this.UserModel(user);
    return (await new_user.save())._id;
  }

  async findOneUser(input: string): Promise<User> {
    let user_found = await this.UserModel.findOne({
      $or: [{ username: input }, { email: input }],
    }).select('+password');
    if (user_found) return user_found;
    else {
      user_found = await this.UserModel.findById(input).select(
        '+password',
      );
      if (user_found) return user_found;
    }
    return undefined;
  }

  async updateUser(id: string, user: User): Promise<User> {
    if (!(await this.UserModel.findById(id))) return undefined;
    const newUser = await this.UserModel.findOneAndUpdate(
      { _id: id },
      user,
    );
    return newUser;
  }

  async throwUserId(NameOrEmail: string): Promise<string> {
    const user_found = await this.UserModel.findOne({
      $or: [{ username: NameOrEmail }, { email: NameOrEmail }],
    });
    if (!user_found) return undefined;
    const user_id = user_found._id;
    return user_id.toString();
  }
}
