import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { JwtService } from 'src/modules/system/jwt/jwt.service';
import { JWT, UserLogIn, UserSignUp, OTPCode } from './auth.entity';
import { User } from 'src/modules/users/user.entity';
import { customAlphabet } from 'nanoid';
import { MailService } from 'src/modules/system/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService, private readonly mailService: MailService) {}

  private async createOTPCode(): Promise<OTPCode> {
    const newOTPCode: OTPCode = {
      code: customAlphabet('1234567890', 6)(),
      dateCreated: new Date().getTime(),
      dateExpired: new Date().getTime() + 5 * 60 * 1000,
    };
    console.log(newOTPCode);
    return newOTPCode;
  }

  async validateUser(NameOrEmail: string, password: string): Promise<User> {
    if (!NameOrEmail) throw new Error('Name or email is required');
    const user = await this.usersService.findOneUser(NameOrEmail);
    const ifMatch = compareSync(password, user.password);
    if (!ifMatch) throw new Error('Wrong password');
    if (!user.OTPCode.verify) throw new Error('Account is not verified');
    return user;
  }

  async SignIn(user: UserLogIn): Promise<JWT> {
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
    const payload = { user_id: new_user._id };
    await this.mailService.sendMail(user.email, OTPCode.code);
    return { access_token: await this.jwtService.CreateToken(payload) };
  }

  async verifyAccount(token: string, OTPCode: string): Promise<string> {
    const payload = await this.jwtService.verifyToken(token);
    const user = await this.usersService.findOneUserById(payload.user_id);
    if (!user) throw new Error('User not found');
    if (user.OTPCode.verify) throw new Error('Account is verified');
    if (user.OTPCode.code !== OTPCode) throw new Error('OTP code is invalid');
    if (user.OTPCode.dateExpired < new Date().getTime()) throw new Error('OTP code is expired');
    user.OTPCode.verify = true;
    await user.save();
    return `Account ${user.username} is verified successfully`;
  }

  async resendOTPCode(token: string): Promise<string> {
    const payload = await this.jwtService.verifyToken(token);
    const user = await this.usersService.findOneUserById(payload.user_id);
    if (!user) throw new Error('User not found');
    if (user.OTPCode.verify) throw new Error('Account is verified');
    const newOTPCode = { verify: false, ...(await this.createOTPCode()) };
    user.OTPCode = newOTPCode;
    await user.save();
    await this.mailService.sendMail(user.email, newOTPCode.code);
    return `OTP code is sent to ${user.email}`;
  }
}
