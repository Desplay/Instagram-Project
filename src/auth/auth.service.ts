import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { JwtService } from 'src/modules/systems/jwt/jwt.service';
import { JWT, UserLogIn, UserSignUp, OTPCode } from '../common/entity/auth.entity';
import { User } from 'src/common/entity/user.entity';
import { customAlphabet } from 'nanoid';
import { MailService } from 'src/modules/systems/mail/mail.service';
import { ProfilesService } from 'src/modules/profiles/profiles.service';
import { ProfileModel } from 'src/common/entity/profile.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly profilesService: ProfilesService,
  ) {}

  private async createOTPCode(): Promise<OTPCode> {
    const newOTPCode: OTPCode = {
      code: customAlphabet('1234567890', 6)(),
      dateCreated: new Date().getTime(),
      dateExpired: new Date().getTime() + 5 * 60 * 1000,
    };
    return newOTPCode;
  }

  private validateOTPCode(OTPCode: string, user: User): boolean {
    if (user.OTPCode.verify) throw new Error('OTP code is verified, please resend new OTP code');
    if (user.OTPCode.code !== OTPCode) throw new Error('OTP code is invalid');
    if (user.OTPCode.dateExpired < new Date().getTime()) throw new Error('OTP code is expired');
    return true;
  }

  private async validateUser(NameOrEmail: string, password: string): Promise<User> {
    if (!NameOrEmail) throw new Error('Name or email is required');
    const user = await this.usersService.findOneUser(NameOrEmail);
    if (!user) throw new Error('User not found');
    const ifMatch = compareSync(password, user.password);
    if (!ifMatch) throw new Error('Wrong password');
    if (!user.verify_account) throw new Error('Account is not verified, please verify this account');
    return user;
  }

  async SignIn(user: UserLogIn): Promise<any> {
    const user_exist = await this.validateUser(user.NameOrEmail, user.password);
    const payload = { user_id: user_exist._id };
    return { access_token: await this.jwtService.CreateToken(payload) };
  }

  async SignUp(user: UserSignUp): Promise<JWT> {
    if (!user) throw new Error('User is invalid');
    if (!user.email) throw new Error('Email is required');
    if (!user.username) throw new Error('Username is required');
    if (user.password.length < 8) throw new Error('Password must be at least 8 characters');
    if ((await this.usersService.findOneUser(user.email)) || (await this.usersService.findOneUser(user.username)))
      throw new Error('User already exists');
    const encodePassword = hashSync(user.password, genSaltSync());
    const OTPCode = await this.createOTPCode();
    const new_user = await this.usersService.createUser(user.email, user.username, encodePassword, OTPCode);
    const new_profile = new ProfileModel({
      name: user.username,
      birthday: null,
      age: null,
      description: null,
      userId: new_user._id,
    });
    await this.profilesService.createProfile(new_profile);
    const payload = { user_id: new_user._id };
    await this.mailService.sendMail(user.email, OTPCode.code);
    return { access_token: await this.jwtService.CreateToken(payload) };
  }

  async verifyAccount(token: string, OTPCode: string): Promise<string> {
    const payload = await this.jwtService.extractToken(token);
    const user = await this.usersService.findOneUserById(payload.user_id);
    if (!user) throw new Error('User not found');
    if (!this.validateOTPCode(OTPCode, user)) throw new Error('OTP code is invalid');
    user.verify_account = true;
    user.OTPCode.verify = true;
    await user.save();
    return `Account ${user.username} is verified successfully`;
  }

  async resendOTPCode(NameOrEmail: string): Promise<string> {
    const user = await this.usersService.findOneUser(NameOrEmail);
    if (!user) throw new Error('User not found');
    if (user.OTPCode.verify) throw new Error('Account is verified');
    const newOTPCode = { verify: false, ...(await this.createOTPCode()) };
    user.OTPCode = newOTPCode;
    await user.save();
    await this.mailService.sendMail(user.email, newOTPCode.code);
    return `OTP code is sent to ${user.email}`;
  }

  async changePassword(token: string, OTPCode: string, newPassword: string): Promise<string> {
    const payload = await this.jwtService.extractToken(token);
    const user = await this.usersService.findOneUserById(payload.user_id);
    if (!user) throw new Error('User not found');
    if (user.OTPCode.verify) throw new Error('OTP code is verified, please resend new OTP code');
    if (!this.validateOTPCode(OTPCode, user)) throw new Error('OTP code is invalid');
    if (newPassword.length < 8) throw new Error('Password must be at least 8 characters');
    const encodePassword = hashSync(newPassword, genSaltSync());
    user.password = encodePassword;
    user.OTPCode.verify = true;
    await user.save();
    return `Password of ${user.username} is changed successfully`;
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await this.usersService.findOneUser(email);
    if (!user) throw new Error('User not found');
    const newOTPCode = { verify: false, ...(await this.createOTPCode()) };
    user.OTPCode = newOTPCode;
    await user.save();
    await this.mailService.sendMail(user.email, newOTPCode.code);
    return `OTP code is sent to ${user.email}, use it to reset password`;
  }
}
