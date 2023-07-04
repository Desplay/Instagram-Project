import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const access_token = GqlExecutionContext.create(context).getContext().req.headers.access_token;
    const payload = this.jwtService.decode(access_token);
    const TimeNow = new Date().getTime();
    const Invalid_token = payload['iat'] === undefined || payload['exp'] === undefined || payload === null || payload['user'] === undefined;
    if (Invalid_token) throw new Error('Invalid token');
    if (payload['iat'] >= payload['exp'] || TimeNow - payload['iat'] > 60) throw new Error('Token expired');
    const user = await this.usersService.findOneUser(payload['user']);
    if (!user) throw new Error('Invalid user');
    return true;
  }
}
