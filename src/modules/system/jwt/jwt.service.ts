import { Injectable } from '@nestjs/common';
import { JwtService as JWTService } from '@nestjs/jwt';
import { jwtConstants } from 'src/config/jwt_constants.config';
@Injectable()
export class JwtService {
  constructor(private readonly jwtService: JWTService) {}
  async CreateToken(payload: any): Promise<string> {
    const new_payload = { ...payload, iat: new Date().getTime() };
    return await this.jwtService.signAsync(new_payload, { secret: jwtConstants.secret });
  }
}
