import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { JWT } from '../common/dto/jwt.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => JWT)
  async SignIn(
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
    const user = { username, email, password };
    return await this.authService.SignUp(user);
  }

  @Mutation(() => String)
  async verifyAccount(@Args({ name: 'OTPCode', type: () => String }) OTPCode: string, @Context('req') req: Request): Promise<string> {
    const token = req.headers['access_token'];
    return await this.authService.verifyAccount(token, OTPCode);
  }

  @Mutation(() => String)
  async resendOTPCode(@Args({ name: 'NameOrEmail', type: () => String }) NameOrEmail: string): Promise<string> {
    return await this.authService.resendOTPCode(NameOrEmail);
  }

  @Mutation(() => String)
  async resetPassword(
    @Args({ name: 'OTPCode', type: () => String }) OTPCode: string,
    @Args({ name: 'password', type: () => String }) password: string,
    @Context('req') req: Request,
  ): Promise<string> {
    const token = req.headers['access_token'];
    return await this.authService.changePassword(token, OTPCode, password);
  }

  @Mutation(() => String)
  async forgotPassword(@Args({ name: 'NameOrEmail', type: () => String }) NameOrEmail: string): Promise<string> {
    return await this.authService.forgotPassword(NameOrEmail);
  }
}
