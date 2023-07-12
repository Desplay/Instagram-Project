import { Module, forwardRef } from '@nestjs/common';
import { JwtModule as JWT } from '@nestjs/jwt';
import { jwtConstants } from 'src/config/jwt_constants.config';
import { JwtService } from './jwt.service';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JWT.register({
      // config in src/config/jwt_constants.config.ts
      secret: jwtConstants.secret,
    }),
  ],
  providers: [JwtService],
  exports: [JWT, JwtService],
})
export class JwtModule {}
