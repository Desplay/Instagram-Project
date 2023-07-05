import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.dto';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Resolver()
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard)
  @Query(() => User)
  async GetUser(@Args({ name: 'UserID', type: () => String }) user_id: string) {
    const user_exist = await this.userService.findOneUserById(user_id);
    if (!user_exist) throw new Error('User not found');
    const user = {
      username: user_exist.username,
      email: user_exist.email,
    };
    return user;
  }
}
