// Service for users module

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  async createUser(email: string, username: string, password: string): Promise<User> {
    if (await this.findOneUser(email)) {
      throw new Error('User already exists!');
    }
    const newUser = new this.UserModel({ email, username, password });
    return await newUser.save();
  }

  async findOneUser(NameOrEmail: string): Promise<User | undefined> {
    let user: User | undefined;
    NameOrEmail.includes('@')
      ? (user = await this.UserModel.findOne({ email: NameOrEmail }).select('+password').exec())
      : (user = await this.UserModel.findOne({ username: NameOrEmail }).select('+password').exec());
    return user;
  }

  async getDetailUser(id: string): Promise<User> {
    const user = await this.UserModel.findById(id).exec();
    if (!user) throw new Error('User not found');
    return user;
  }

  async findOneUserById(id: string): Promise<User | undefined> {
    const user = await this.UserModel.findById(id).exec();
    return user;
  }
}
