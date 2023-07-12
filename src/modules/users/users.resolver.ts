import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.dto';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Resolver()
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  // @UseGuards(AuthGuard)
  // @Query(() => User)
  // async GetUser(@Context('req') req: Request): Promise<User> {
  //   const access_token = req.headers['access_token'];
  //   const payload = await this.userService.verifyToken(access_token);
  //   const user_exist = await this.userService.findOneUserById(payload.user_id);
  //   if (!user_exist) throw new Error('User not found');
  //   const user = {
  //     username: user_exist.username,
  //     email: user_exist.email,
  //   };
  //   return user;
  // }
}
