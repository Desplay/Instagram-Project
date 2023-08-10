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

  validateOTPCode(Code: string, user: User): boolean {
    const OTPCode = user.OTPCode;
    const invalid_OTPCode =
      !OTPCode &&
      OTPCode.code !== Code &&
      OTPCode.dateExpired < new Date().getTime();
    if (invalid_OTPCode) {
      throw new ForbiddenException('OTPCode is invalid');
    }
    return true;
  }

  async validateUserExist(input: string): Promise<User> {
    const user = await this.usersService.findOneUser(input);
    if (!user) {
      throw new ForbiddenException('User is not exist');
    }
    return user;
  }

  async validateSignIn(
    NameOrEmail: string,
    password: string,
  ): Promise<User> {
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

  async getUserIdFromHeader(header: any): Promise<string> {
    const payload = await this.jwtService.getPayloadFromAuthorization(
      header,
    );
    const user_id = payload['user_id'];
    const user = await this.usersService.findOneUser(user_id);
    if (!user) {
      throw new ForbiddenException('User is not exist');
    }
    return user_id;
  }
}
