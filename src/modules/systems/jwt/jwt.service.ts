import { Injectable } from '@nestjs/common';
import { JwtService as JWTService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
@Injectable()
export class JwtService {
  constructor(private readonly jwtService: JWTService, private readonly usersService: UsersService) {}

  async verifyToken(token: string): Promise<any> {
    if (!token) throw new Error('Invalid token');
    const payload = await this.jwtService.verifyAsync(token);
    const Invalid_token = payload === null || payload['user_id'] === undefined || payload['iat'] === undefined || payload['exp'] === undefined;
    if (Invalid_token) throw new Error('Invalid token');
    const timeNow = new Date().getTime();
    if (timeNow < payload['iat'] || timeNow > payload['exp']) throw new Error('Token expired');
    const user = await this.usersService.findOneUserById(payload['user_id']);
    if (!user) throw new Error('Invalid user');
    if (!user.OTPCode.verify) throw new Error('user is not verified');
    return payload;
  }

  async CreateToken(payload: any): Promise<string> {
    const new_payload = { ...payload, iat: new Date().getTime(), exp: new Date().getTime() + 60 * 60 * 1000 };
    return await this.jwtService.signAsync(new_payload);
  }
}
