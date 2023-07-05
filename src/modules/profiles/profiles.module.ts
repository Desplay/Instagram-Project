import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProfilesService } from './profiles.service';
import { ProfilesResolver } from './profiles.resolver';
import { ProfileSchema } from './profiles.entity';
<<<<<<< Updated upstream
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/config/jwt_constants.config';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema }]),
    JwtModule.register({ secret: jwtConstants.secret }),
    UsersModule,
  ],
  providers: [
    ProfilesService,
    ProfilesResolver,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
=======
import { UsersModule } from '../users/users.module';
import { JwtModule } from '../system/jwt/jwt.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema }]), JwtModule, UsersModule],
  providers: [ProfilesService, ProfilesResolver],
>>>>>>> Stashed changes
})
export class ProfilesModule {}
