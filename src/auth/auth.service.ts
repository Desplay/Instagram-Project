import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthPayLoad } from './auth.entity';
import { User } from 'src/modules/users/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async validateUser(NameOrEmail: string, password: string): Promise<User | undefined> {
    const user = await this.usersService.findOneUser(NameOrEmail);
    if (!user) throw new Error('User not found');
    const ifMatch = compareSync(password, user.password);
    if (ifMatch) return user;
    throw new Error('Wrong password');
  }

  async SignIn(userdto: any): Promise<AuthPayLoad> {
    const user = await this.validateUser(userdto.NameOrEmail, userdto.password);
    const payload = { user: user.username, id_user: user._id };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async SignUp(username: string, email: string, password: string): Promise<AuthPayLoad> {
    if ((await this.usersService.findOneUser(email)) || (await this.usersService.findOneUser(username))) throw new Error('User already exists');
    const encodePassword = hashSync(password, genSaltSync());
    const user = await this.usersService.createUser(username, email, encodePassword);
    const payload = { user: user.username, id_user: user._id };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
