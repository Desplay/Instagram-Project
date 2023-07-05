import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { JwtService } from 'src/modules/system/jwt/jwt.service';
import { AuthPayLoad } from './auth.entity';
import { User } from 'src/modules/users/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async validateUser(NameOrEmail: string, password: string): Promise<User> {
    const user = await this.usersService.findOneUser(NameOrEmail);
    const ifMatch = compareSync(password, user.password);
    if (ifMatch) return user;
    throw new Error('Wrong password');
  }

  async SignIn(user: any): Promise<AuthPayLoad> {
    const user_exist = await this.validateUser(user.NameOrEmail, user.password);
    const payload = { user_id: user_exist._id };
    return { access_token: await this.jwtService.CreateToken(payload) };
  }

  async SignUp(user: any): Promise<AuthPayLoad> {
    if ((await this.usersService.findOneUser(user.email)) || (await this.usersService.findOneUser(user.username)))
      throw new Error('User already exists');
    const encodePassword = hashSync(user.password, genSaltSync());
    const new_user = await this.usersService.createUser(user.email, user.username, encodePassword);
    const payload = { user_id: new_user._id };
    return { access_token: await this.jwtService.CreateToken(payload) };
  }
}
