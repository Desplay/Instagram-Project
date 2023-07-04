// Resolvers are responsible for mapping incoming requests to the corresponding service, and returning the response.

import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.dto';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}
  @Query(() => User)
  async GetUser(@Args({ name: 'UserNameOrEmail', type: () => String }) input: string) {
    const user = await this.userService.findOneUser(input);
    if (!user) throw new Error('User not found');
    const new_user = {
      username: user.username,
      email: user.email,
    };
    return new_user;
  }
}
