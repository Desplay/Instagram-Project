import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { genSaltSync, hashSync } from 'bcrypt';
import { JwtService } from 'src/common/jwt/jwt.service';
import { Authorization, UserSignIn } from 'src/auth/datatype/auth.entity';
import { Profile } from 'src/profiles/datatype/profile.entity';
import { MailService } from 'src/common/mail/mail.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import { AuthErrorHanding } from './auth.validate';
import { UserSignUp } from 'src/users/datatype/user.dto';
import { User } from 'src/users/datatype/user.entity';
import createOTPCode from 'src/utils/otpcode.generate';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly profilesService: ProfilesService,
    private readonly authErrorHanding: AuthErrorHanding,
  ) {}

  private async createUserType(user: UserSignUp): Promise<User> {
    const user_exist =
      (await this.usersService.findOneUser(user.username)) ||
      (await this.usersService.findOneUser(user.email));
    if (user_exist) return undefined;
    const encodePassword = hashSync(user.password, genSaltSync());
    const OTPCode = createOTPCode();
    const new_user = {
      deactive: false,
      verify_account: false,
      username: user.username,
      email: user.email,
      password: encodePassword,
      OTPCode,
    };
    return new_user;
  }

  private createProfileType(user: UserSignUp): Profile {
    const new_profile: Profile = {
      name: user.username,
      birthday: null,
      age: null,
      description: null,
      userId: null,
    };
    return new_profile;
  }

  async SignIn(user: UserSignIn): Promise<Authorization> {
    const user_exist = await this.authErrorHanding.validateUserSignIn(
      user.NameOrEmail,
      user.password,
    );
    const user_id = await this.usersService.throwUserId(
      user_exist.username,
    );

    const payload = { user_id: user_id };
    const authorization = await this.jwtService.CreateToken(payload);
    return { authorization: authorization };
  }

  async SignUp(user: UserSignUp): Promise<Authorization> {
    const new_user = await this.createUserType(user);
    if (!new_user) return undefined;
    const user_id = await this.usersService.createUser(new_user);
    const new_profile = this.createProfileType(user);
    await this.profilesService.createProfile(new_profile, user_id);
    const signUp_done = await this.authErrorHanding.validateSignUp(
      user_id,
    );
    if (!signUp_done) return undefined;
    await this.mailService.sendMail(new_user.email, new_user.OTPCode.code);
    const payload = { user_id: user_id };
    const authorization = await this.jwtService.CreateToken(payload);
    return { authorization: authorization };
  }

  async verifyAccount(user_id: string, OTPCode: string): Promise<boolean> {
    const user = await this.authErrorHanding.validateUserExist(user_id);
    if (!this.authErrorHanding.validateOTPCode(OTPCode, user))
      return false;
    user.verify_account = true;
    user.OTPCode.verify = true;
    await this.usersService.updateUser(user_id, user);
    return true;
  }

  async resendOTPCode(NameOrEmail: string): Promise<string> {
    const user = await this.authErrorHanding.validateUserExist(
      NameOrEmail,
    );
    if (!user.verify_account) return undefined;
    const user_id = await this.usersService.throwUserId(user.username);
    user.OTPCode = createOTPCode();
    await this.usersService.updateUser(user_id, user);
    await this.mailService.sendMail(user.email, user.OTPCode.code);
    const message = `OTP code is sent to ${user.email}`;
    return message;
  }

  async changePassword(
    verify: {
      user_id: string;
      OTPCode: string;
    },
    newPassword: string,
  ): Promise<string> {
    const user_id = verify.user_id;
    const OTPCode = verify.OTPCode;
    const user = await this.authErrorHanding.validateUserExist(user_id);
    this.authErrorHanding.validateOTPCode(OTPCode, user);
    const encodePassword = hashSync(newPassword, genSaltSync());
    user.password = encodePassword;
    user.OTPCode.verify = true;
    const message = `Password of ${user.username} is changed successfully`;
    return message;
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await this.authErrorHanding.validateUserExist(email);
    const user_id = await this.usersService.throwUserId(user.username);
    if (!user) throw new Error('User not found');
    user.OTPCode = createOTPCode();
    await this.usersService.updateUser(user_id, user);
    await this.mailService.sendMail(user.email, user.OTPCode.code);
    const message = `OTP code is sent to ${user.email}, use it to reset password`;
    return message;
  }
}
