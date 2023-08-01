import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from 'src/users/datatype/user.entity';
import { UsersService } from '../users/users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from 'src/common/jwt/jwt.service';
import { ProfileErrorHanding } from 'src/profiles/profiles.validate';

@Injectable()
export class AuthErrorHanding {
  constructor(
    private readonly usersService: UsersService,
    private readonly profilesErrorHanding: ProfileErrorHanding,
    private readonly jwtService: JwtService,
  ) {}

  validateOTPCode(OTPCode: string, user: User): boolean {
    if (user.OTPCode.verify) {
      throw new ForbiddenException('OTP code is verified');
    }
    if (user.OTPCode.code !== OTPCode)
      throw new ForbiddenException('Wrong OTP code');
    if (user.OTPCode.dateExpired < new Date().getTime())
      throw new ForbiddenException('OTP code is expired');
    return true;
  }

  async validateUserExist(input: string): Promise<User> {
    const user =
      (await this.usersService.findOneUser(input)) ||
      (await this.usersService.findOneUserById(input));
    if (!user) {
      throw new ForbiddenException('User is not exist');
    }
    return user;
  }

  async validateSignIn(
    NameOrEmail: string,
    password: string,
  ): Promise<User> {
    if (!NameOrEmail) {
      throw new ForbiddenException('Name or email is empty');
    }
    const user_exist = await this.usersService.findOneUser(NameOrEmail);
    if (!user_exist) {
      throw new ForbiddenException('User is not exist');
    }
    const ifMatch = compareSync(password, user_exist.password);
    if (!ifMatch) {
      throw new ForbiddenException('Password is wrong');
    }
    if (!user_exist.verify_account) {
      throw new ForbiddenException('User is not verify');
    }
    return user_exist;
  }

  async validateSignUp(user_id: string): Promise<boolean> {
    if (!user_id) throw new ForbiddenException('User id is empty');
    const user_exist = await this.usersService.findOneUserById(user_id);
    if (!user_exist) {
      throw new ForbiddenException('Sign up is not success');
    }
    const profile_exist =
      await this.profilesErrorHanding.validateProfileExist(user_id);
    if (!profile_exist) {
      throw new ForbiddenException('Sign up is not success');
    }
    return true;
  }

  async validateAuthorization(header: any): Promise<string> {
    const authorization = header.authorization;
    if (!authorization) {
      throw new ForbiddenException('Authorization is empty');
    }
    const payload = await this.jwtService.getAuthorization({
      authorization: authorization,
    });
    const user_id = payload['user_id'];
    const user = await this.usersService.findOneUserById(user_id);
    if (!user) {
      throw new ForbiddenException('User is not exist');
    }
    return user_id;
  }
}
