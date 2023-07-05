import { Module } from '@nestjs/common';
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
import { AuthController } from './auth.controller';
=======
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from 'src/modules/users/users.module';
import { JwtModule } from 'src/modules/system/jwt/jwt.module';
>>>>>>> Stashed changes
import { AuthService } from './auth.service';
import { UsersModule } from 'src/modules/users/users.module';
>>>>>>> Stashed changes
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { jwtConstants } from 'src/config/jwt_constants.config';
import { UsersModule } from 'src/modules/users/users.module';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

@Module({
<<<<<<< Updated upstream
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    UsersModule,
  ],
<<<<<<< Updated upstream
  providers: [AuthService, AuthResolver],
=======
  controllers: [AuthController],
  providers: [AuthService],
=======
  imports: [PassportModule, JwtModule, UsersModule],
  providers: [AuthService, AuthResolver],
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  exports: [AuthService],
})
export class AuthModule {}
