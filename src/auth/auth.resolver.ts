import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserSignUp, UserSignIn } from 'src/users/datatype/user.dto';
import { AuthPayload } from 'src/auth/datatype/auth.dto';
import { AuthErrorHanding } from './authValidate.service';
import { ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly authErrorHanding: AuthErrorHanding,
  ) {}

  @Query(() => String)
  async hello(): Promise<string> {
    return 'Hello World!';
  }

  @Mutation(() => AuthPayload)
  async SignIn(
    @Args({ name: 'UserSignIn', type: () => UserSignIn })
    user: UserSignIn,
  ): Promise<AuthPayload> {
    const userTypeSignIn = {
      NameOrEmail: user.username ? user.username : user.email,
      password: user.password,
    };
    const authPayload = await this.authService.SignIn(userTypeSignIn);
    return authPayload;
  }

  @Mutation(() => String)
  async SignOut(@Context('req') req: Request): Promise<string> {
    if (!req.headers.authorization) {
      throw new ForbiddenException('Request header !');
    }
    const user_id = await this.authErrorHanding.getUserIdFromHeader(
      req.headers,
    );
    const user = await this.authErrorHanding.validateUserExist(user_id);
    if (!user.login) {
      throw new ForbiddenException('User is not login');
    }
    user.login = false;
    await this.authService.SignOut(user_id, user);
    const message = 'Sign out done!';
    return message;
  }

  @Mutation(() => String)
  async SignUp(
    @Args({ name: 'UserSignUp', type: () => UserSignUp })
    user: UserSignUp,
  ): Promise<string> {
    const user_exist = await this.authErrorHanding.validateSignUp(user);
    if (user_exist) {
      throw new ForbiddenException('User is already exist');
    }
    const SignUpDone = await this.authService.SignUp(user);
    if (!SignUpDone) {
      throw new ForbiddenException(
        'Sign up failed!, account already exist or invalid input type',
      );
    }
    const message = 'Sign up done!, you need to verify your account';
    return message;
  }

  @Mutation(() => String)
  async verifyAccount(
    @Args({ name: 'OTPCode', type: () => String }) OTPCode: string,
    @Args({ name: 'email', type: () => String }) email: string,
  ): Promise<string> {
    const user_id = await this.authService.getUserId(email);
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
    const status = await this.authService.resendOTPCode(NameOrEmail);
    if (!status) {
      throw new ForbiddenException(
        'Resend OTPCode failed!, account not exist or allready verify',
      );
    }
    const message = status;
    return message;
  }

  @Mutation(() => String)
  async changePassword(
    @Args({ name: 'OTPCode', type: () => String }) OTPCode: string,
    @Args({ name: 'password', type: () => String }) password: string,
    @Context('req') req: Request,
  ): Promise<string> {
    const user_id = await this.authErrorHanding.getUserIdFromHeader(
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
