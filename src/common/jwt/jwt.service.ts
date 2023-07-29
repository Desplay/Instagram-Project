import { Injectable } from '@nestjs/common';
import { JwtService as JWTService } from '@nestjs/jwt';
import { Payload } from 'src/auth/datatype/payload.dto';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: JWTService,
    private readonly usersService: UsersService,
  ) {}

  private validatePayload(payload: Payload): boolean {
    if (!payload) return false;
    const Invalid_payload =
      payload['user_id'] === undefined ||
      payload['iat'] === undefined ||
      payload['exp'] === undefined;
    if (Invalid_payload) return false;
    const timeNow = new Date().getTime();
    const Invalid_time =
      timeNow < payload['iat'] || timeNow > payload['exp'];
    if (Invalid_time) return false;
    return true;
  }

  private async extractToken(token: string): Promise<Payload> {
    const payload = await this.jwtService.verifyAsync(token);
    const Invalid_payload = this.validatePayload(payload);
    if (!Invalid_payload) {
      return undefined;
    }
    return payload;
  }

  async verifyToken(token: string): Promise<Payload> {
    const payload = await this.extractToken(token);
    const user = await this.usersService.findOneUserById(
      payload['user_id'],
    );
    if (!user || !user.verify_account) {
      return undefined;
    }

    return payload;
  }

  async getAuthorization(header: any): Promise<Payload> {
    const authorization = header['authorization'];
    if (!authorization) {
      return undefined;
    }
    return await this.verifyToken(authorization);
  }

  async CreateToken(payload: any): Promise<string> {
    const new_payload = {
      ...payload,
      iat: new Date().getTime(),
      exp: new Date().getTime() + 60 * 60 * 1000,
    };
    return await this.jwtService.signAsync(new_payload);
  }
}
