import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UsersService } from 'src/modules/users/users.service';
import { jwtConstants } from 'src/config/jwt_constants.config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private readonly usersService: UsersService) {}

  private async validateToken(token: string): Promise<boolean> {
    const token_valid = await this.jwtService.verify(token, { secret: jwtConstants.secret });
    if (!token_valid) throw new Error('Invalid token');
    const payload = this.jwtService.decode(token);
    const Invalid_token = payload === null || payload['user_id'] === undefined || payload['iat'] === undefined || payload['exp'] === undefined;
    if (Invalid_token) throw new Error('Invalid token');
    if (payload['iat'] >= payload['exp']) throw new Error('Token expired');
    const user = await this.usersService.findOneUserById(payload['user_id']);
    if (!user) throw new Error('Invalid user');
    return true;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const access_token = GqlExecutionContext.create(context).getContext().req.headers.access_token;
    if (!access_token) throw new Error('Access token not found');
    const token_valid = await this.validateToken(access_token);
    if (token_valid) return true;
  }
}
