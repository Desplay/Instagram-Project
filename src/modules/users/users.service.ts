// Service for users module

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../common/entity/user.entity';
import { OTPCode } from 'src/common/entity/auth.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  async createUser(email: string, username: string, password: string, OTPCode: OTPCode): Promise<User> {
    if (await this.findOneUser(email)) throw new Error('User already exists!');
    const newUser = new this.UserModel({
      deactive: false,
      verify_account: false,
      email,
      username,
      password,
      OTPCode: {
        verify: false,
        ...OTPCode,
      },
    }) as User;
    return await newUser.save();
  }

  async findOneUser(NameOrEmail: string): Promise<User | undefined> {
    let user: User | undefined;
    NameOrEmail.includes('@')
      ? (user = await this.UserModel.findOne({ email: NameOrEmail }).select('+password'))
      : (user = await this.UserModel.findOne({ username: NameOrEmail }).select('+password'));
    return user;
  }

  async findOneUserById(id: any): Promise<User> {
    const user = await this.UserModel.findById(id.toString()).exec();
    return user;
  }

  async updateUser(id: string, email: string, username: string, password: string, OTPCode: OTPCode): Promise<User> {
    if (!(await this.UserModel.findById(id))) throw new Error('User not found');
    const newUser = await this.UserModel.findByIdAndUpdate(id, { email: email, username: username, password: password, OTPCode: OTPCode }).exec();
    return newUser;
  }
}
