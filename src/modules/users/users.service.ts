// Service for users module

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

<<<<<<< Updated upstream
  async createUser(username: string, email: string, password: string): Promise<User | undefined> {
=======
<<<<<<< Updated upstream
  async createUser(name: string, email: string, password: string): Promise<User | undefined> {
=======
  async createUser(username: string, email: string, password: string): Promise<User> {
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    if (await this.findOneUser(email)) {
      throw new Error('User already exists!');
    }
    const newUser = new this.UserModel({ username, email, password });
    return await newUser.save();
  }

<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
  async findOneUser(email: string): Promise<User | undefined> {
    return await this.UserModel.findOne({ email }).exec();
=======
>>>>>>> Stashed changes
  async findOneUser(NameOrEmail: string): Promise<User | undefined> {
    let user: User | undefined;
    NameOrEmail.includes('@')
      ? (user = await this.UserModel.findOne({ email: NameOrEmail }).select('+password').exec())
      : (user = await this.UserModel.findOne({ username: NameOrEmail }).select('+password').exec());
    return user;
  }

<<<<<<< Updated upstream
  async getDetailUser(id: string): Promise<User | undefined> {
    return await this.UserModel.findById(id).exec();
=======
  async getDetailUser(id: string): Promise<User> {
    const user = await this.UserModel.findById(id).exec();
    if (!user) throw new Error('User not found');
    return user;
  }

  async findOneUserById(id: string): Promise<User | undefined> {
    const user = await this.UserModel.findById(id).exec();
    return user;
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  }
}
