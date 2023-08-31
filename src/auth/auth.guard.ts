import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from 'src/common/jwt/jwt.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const getContext = GqlExecutionContext.create(context).getContext();
    const payload = await this.jwtService.getPayloadFromAuthorization(
      getContext.req.headers,
    );
    if (!payload) {
      throw new UnauthorizedException(
        'authorization header is required or invalid',
      );
    }
    return true;
  }
}
