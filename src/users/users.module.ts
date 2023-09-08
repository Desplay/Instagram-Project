import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './users.service';
import { UserSchema } from './datatype/user.entity';
import { JwtModule } from '../common/jwt/jwt.module';
import { UsersResolver } from './users.resolver';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthErrorHanding } from 'src/auth/authValidate.service';
import { AuthModule } from 'src/auth/auth.module';
import { ProfileErrorHanding } from 'src/profiles/profilesValidate.service';
import { ProfilesModule } from 'src/profiles/profiles.module';

@Module({
  imports: [
    forwardRef(() => JwtModule),
    forwardRef(() => AuthModule),
    forwardRef(() => ProfilesModule),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [
    UsersService,
    UsersResolver,
    AuthGuard,
    AuthErrorHanding,
    ProfileErrorHanding,
  ],
  exports: [UsersService],
})
export class UsersModule {}
