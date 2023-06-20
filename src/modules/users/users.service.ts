// Service for users module

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  async createUser(name: string, email: string, password: string): Promise<User | undefined> {
    if (await this.findOneUser(email)) {
      throw new Error('User already exists!');
    }
    const newUser = new this.UserModel({ name, email, password });
    return await newUser.save();
  }

  async findOneUser(email: string): Promise<User | undefined> {
    return await this.UserModel.findOne({ email }).exec();
  }
}
