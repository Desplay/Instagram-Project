import { Injectable } from '@nestjs/common';
import { JwtService as JWTService } from '@nestjs/jwt';
import { Payload } from 'src/common/jwt/payload.dto';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: JWTService,
    private readonly usersService: UsersService,
  ) {}

  async verifyToken(token: string): Promise<Payload> {
    const payload = await this.extractToken(token);
    if (!payload) {
      return undefined;
    }
    const user = await this.usersService.findOneUser(payload['user_id']);
    if (!user || !user.verify_account) {
      return undefined;
    }

    return payload;
  }

  async getPayloadFromAuthorization(header: any): Promise<Payload> {
    const token = header['authorization'];
    return token ? await this.verifyToken(token) : undefined;
  }

  async CreateToken(payload: any): Promise<string> {
    const new_payload = {
      ...payload,
      iat: new Date().getTime(),
      exp: new Date().getTime() + 60 * 60 * 1000,
    };
    return await this.jwtService.signAsync(new_payload);
  }

  private validatePayload(payload: Payload): boolean {
    if (!payload) return false;
    const Valid_payload =
      payload['user_id'] && payload['iat'] && payload['exp'];
    if (!Valid_payload) return false;
    const timeNow = new Date().getTime();
    const Invalid_time =
      timeNow < payload['iat'] || timeNow > payload['exp'];
    if (Invalid_time) return false;
    return true;
  }

  private async extractToken(token: string): Promise<Payload> {
    const payload = await this.jwtService.verifyAsync(token);
    const Valid_payload = this.validatePayload(payload);
    return Valid_payload ? payload : undefined;
  }
}
