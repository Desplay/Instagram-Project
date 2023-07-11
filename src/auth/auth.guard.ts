import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from 'src/modules/system/jwt/jwt.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const access_token = GqlExecutionContext.create(context).getContext().req.headers.access_token;
    if (!access_token) throw new Error('Access token not found');
    if (await this.jwtService.verifyToken(access_token)) return true;
    return false;
  }
}
