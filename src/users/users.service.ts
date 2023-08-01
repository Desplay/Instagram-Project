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
    if (
      (await this.findOneUser(user.email)) ||
      (await this.findOneUser(user.username))
    ) {
      return undefined;
    }
    const new_user = new this.UserModel(user);
    return (await new_user.save())._id;
  }

  async findOneUser(NameOrEmail: string): Promise<User> {
    let user: User | undefined;
    NameOrEmail.includes('@')
      ? (user = await this.UserModel.findOne({
          email: NameOrEmail,
        }).select('+password'))
      : (user = await this.UserModel.findOne({
          username: NameOrEmail,
        }).select('+password'));
    return user;
  }

  async findOneUserById(id: string): Promise<User> {
    const user = await this.UserModel.findById(id);
    return user;
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
    const user = await this.findOneUser(NameOrEmail);
    if (!user) {
      return undefined;
    }
    const user_found = await this.UserModel.findOne({
      username: user.username,
    });
    const user_id = user_found._id;
    return user_id.toString();
  }
}
