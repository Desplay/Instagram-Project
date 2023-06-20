import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';

const SALTS = 10;

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async SignIn(email: string, password: string) {
    const user = await this.usersService.findOneUser(email);
    if (compareSync(user.password, password)) throw new Error('Password is incorrect');
    const payload = { sub: user._id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async SignUp(name: string, email: string, password: string) {
    if (await this.usersService.findOneUser(email)) throw new Error('User already exists');
    const encodePassword = hashSync(password, genSaltSync(SALTS));
    const user = await this.usersService.createUser(name, email, encodePassword);
    const payload = { sub: user._id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
