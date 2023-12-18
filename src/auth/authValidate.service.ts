import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from 'src/users/datatype/user.entity';
import { UsersService } from '../users/users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from 'src/common/jwt/jwt.service';
import { UserSignUp } from 'src/users/datatype/user.dto';

@Injectable()
export class AuthErrorHanding {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  validateOTPCode(Code: string, user: User): boolean {
    const { OTPCode } = user;
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
    // if (user_exist.login) {
    //   throw new ForbiddenException('User is already login');
    // }
    const ifMatch = compareSync(password, user_exist.password);
    if (!ifMatch) {
      throw new ForbiddenException('Password is wrong');
    }
    if (!user_exist.verify_account) {
      throw new ForbiddenException('User is not verify');
    }
    return user_exist;
  }

  async validateSignUp(user: UserSignUp): Promise<User> {
    const user_exist = await this.usersService.findOneUser(user.email);
    if (user_exist) {
      throw new ForbiddenException('User is already exist');
    }
    return user_exist;
  }

  async getUserIdFromHeader(header: any): Promise<string> {
    const payload = await this.jwtService.getPayloadWithOutVerify(header);
    const user_id = payload['user_id'];
    const user = await this.usersService.findOneUser(user_id);
    if (!user) {
      throw new ForbiddenException('User is not exist');
    }
    return user_id;
  }
}
