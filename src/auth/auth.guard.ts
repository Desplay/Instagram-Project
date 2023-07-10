import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private readonly usersService: UsersService) {}

  private async validateToken(token: string): Promise<boolean> {
    if (!token) throw new Error('Invalid token');
    try {
      const payload = this.jwtService.verifyAsync(token);
      const Invalid_token = payload === null || payload['user_id'] === undefined || payload['iat'] === undefined || payload['exp'] === undefined;
      if (Invalid_token) throw new Error('Invalid token');
      const timeNow = new Date().getTime();
      if (timeNow < payload['iat'] || timeNow > payload['exp']) throw new Error('Token expired');
      const user = await this.usersService.findOneUserById(payload['user_id']);
      if (!user) throw new Error('Invalid user');
      return true;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const access_token = GqlExecutionContext.create(context).getContext().req.headers.access_token;
    if (!access_token) throw new Error('Access token not found');
    return await this.validateToken(access_token);
  }
}
