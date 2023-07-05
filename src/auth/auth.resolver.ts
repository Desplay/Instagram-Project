import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
<<<<<<< Updated upstream
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JWT } from './auth.dto';
import { AuthGuard } from './auth.guard';
=======
import { AuthService } from './auth.service';
import { JWT } from './auth.dto';
>>>>>>> Stashed changes

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => JWT)
<<<<<<< Updated upstream
  async LogIn(
=======
  async SignIn(
>>>>>>> Stashed changes
    @Args({ name: 'UsernameOrEmail', type: () => String }) NameOrEmail: string,
    @Args({ name: 'password', type: () => String }) password: string,
  ): Promise<JWT> {
    const user = { NameOrEmail, password };
    const token = await this.authService.SignIn(user);
    return token;
  }

  @Mutation(() => JWT)
  async SignUp(
    @Args({ name: 'username', type: () => String }) username: string,
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'password', type: () => String }) password: string,
  ): Promise<JWT> {
<<<<<<< Updated upstream
    return await this.authService.SignUp(username, email, password);
  }

  @UseGuards(AuthGuard)
  @Query(() => String)
  async test(): Promise<string> {
    return 'Hello World!';
=======
    const user = { username, email, password };
    return await this.authService.SignUp(user);
>>>>>>> Stashed changes
  }
}
