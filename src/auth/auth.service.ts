import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { JwtService } from 'src/modules/system/jwt/jwt.service';
import { JWT, UserLogIn, UserSignUp } from './auth.entity';
import { User } from 'src/modules/users/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async validateUser(NameOrEmail: string, password: string): Promise<User> {
    if (!NameOrEmail) throw new Error('Name or email is required');
    const user = await this.usersService.findOneUser(NameOrEmail);
    const ifMatch = compareSync(password, user.password);
    if (ifMatch) return user;
    throw new Error('Wrong password');
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
    const new_user = await this.usersService.createUser(user.email, user.username, encodePassword);
    const payload = { user_id: new_user._id };
    return { access_token: await this.jwtService.CreateToken(payload) };
  }
}
