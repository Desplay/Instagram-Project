import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from 'src/common/jwt/jwt.service';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthErrorHanding } from './auth.validate';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authErrorHanding: AuthErrorHanding,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const getContext = GqlExecutionContext.create(context).getContext();
    const authorization = await this.jwtService.getAuthorization(
      getContext.req.headers,
    );
    if (!authorization) {
      throw new UnauthorizedException(
        'authorization header is required or invalid',
      );
    }
    const valid_authorization =
      await this.authErrorHanding.validateUserExist(authorization.user_id);
    if (!valid_authorization) {
      throw new UnauthorizedException('invalid authorization');
    }
    return true;
  }
}
