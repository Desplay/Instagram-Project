import { Module } from '@nestjs/common';
import { JwtModule as JWT } from '@nestjs/jwt';
import { jwtConstants } from 'src/config/jwt_constants.config';
import { JwtService } from './jwt.service';

@Module({
  imports: [
    JWT.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [JwtService],
  exports: [JWT, JwtService],
})
export class JwtModule {}
