// Resolvers are responsible for mapping incoming requests to the corresponding service, and returning the response.

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
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
  }
}
