import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
<<<<<<< Updated upstream
import { JwtService } from '@nestjs/jwt';
import { AuthPayLoad } from './auth.entity';
import { User } from 'src/modules/users/user.entity';
=======
<<<<<<< Updated upstream

const SALTS = 10;
=======
import { JwtService } from 'src/modules/system/jwt/jwt.service';
import { AuthPayLoad } from './auth.entity';
import { User } from 'src/modules/users/user.entity';
>>>>>>> Stashed changes
>>>>>>> Stashed changes

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

<<<<<<< Updated upstream
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
=======
<<<<<<< Updated upstream
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
=======
  async validateUser(NameOrEmail: string, password: string): Promise<User | undefined> {
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
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  }
}
