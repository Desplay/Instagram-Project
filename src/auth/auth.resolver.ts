import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserSignUpPipe, UserSignInPipe } from './auth.pipe';
import { UserSignUp, UserSignIn } from 'src/users/datatype/user.dto';
import { Authorization } from 'src/auth/datatype/auth.dto';
import { AuthErrorHanding } from './auth.validate';
import { ForbiddenException } from '@nestjs/common';
import { JwtService } from 'src/common/jwt/jwt.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly authErrorHanding: AuthErrorHanding,
  ) {}

  @Query(() => Authorization)
  async SignIn(
    @Args(
      { name: 'UserSignIn', type: () => UserSignIn },
      new UserSignInPipe(),
    )
    user: UserSignIn,
  ): Promise<Authorization> {
    const userTypeSignIn = {
      NameOrEmail: user.username ? user.username : user.email,
      password: user.password,
    };
    const authorization = await this.authService.SignIn(userTypeSignIn);
    return authorization;
  }

  @Mutation(() => Authorization)
  async SignUp(
    @Args(
      { name: 'UserSignUp', type: () => UserSignUp },
      new UserSignUpPipe(),
    )
    user: UserSignUp,
  ): Promise<Authorization> {
    const token = await this.authService.SignUp(user);
    if (!token) {
      throw new ForbiddenException(
        'Sign up failed!, account already exist or invalid input type',
      );
    }
    return token;
  }

  @Mutation(() => String)
  async verifyAccount(
    @Args({ name: 'OTPCode', type: () => String }) OTPCode: string,
    @Context('req') req: Request,
  ): Promise<string> {
    const token: string = req.headers['authorization'];
    const user_id = await this.authErrorHanding.validateAuthorization(
      token,
    );
    const verifyAccountDone = await this.authService.verifyAccount(
      user_id,
      OTPCode,
    );
    if (verifyAccountDone) {
      const message = 'Verify account done!';
      return message;
    }
    const message = 'Verify account fail!';
    return message;
  }

  @Mutation(() => String)
  async resendOTPCode(
    @Args({ name: 'NameOrEmail', type: () => String })
    NameOrEmail: string,
  ): Promise<string> {
    return await this.authService.resendOTPCode(NameOrEmail);
  }

  @Mutation(() => String)
  async changePassword(
    @Args({ name: 'OTPCode', type: () => String }) OTPCode: string,
    @Args({ name: 'password', type: () => String }) password: string,
    @Context('req') req: Request,
  ): Promise<string> {
    const user_id = await this.authErrorHanding.validateAuthorization(
      req.headers,
    );
    const verify = {
      user_id,
      OTPCode,
    };
    return await this.authService.changePassword(verify, password);
  }

  @Mutation(() => String)
  async forgotPassword(
    @Args({ name: 'NameOrEmail', type: () => String })
    NameOrEmail: string,
  ): Promise<string> {
    return await this.authService.forgotPassword(NameOrEmail);
  }
}
