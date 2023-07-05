// Resolvers are responsible for mapping incoming requests to the corresponding service, and returning the response.

import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.dto';
import { UsersService } from './users.service';
<<<<<<< Updated upstream

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
=======
<<<<<<< Updated upstream
import { AuthService } from 'src/auth/auth.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly userService: UsersService, private readonly authService: AuthService) {}

  @Query(() => String)
  hello(): string {
    return 'Hello, World!';
  }

  @Query(() => String)
  async LogIn(
    @Args({ name: 'name', type: () => String }) name: string,
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'password', type: () => String }) password: string,
  ) {
    return (await this.authService.SignIn(email, password)).access_token;
  }

  @Mutation(() => String)
  async SignUp(
    @Args({ name: 'name', type: () => String }) name: string,
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'password', type: () => String }) password: string,
  ): Promise<string> {
    return (await this.authService.SignUp(name, email, password)).access_token;
=======
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
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  }
}
