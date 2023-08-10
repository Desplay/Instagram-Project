import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProfilesService } from './profiles.service';
import { ProfilesResolver } from './profiles.resolver';
import { ProfileSchema } from './datatype/profile.entity';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '../common/jwt/jwt.module';
import { ProfilePipe } from './profiles.pipe';
import { AuthModule } from 'src/auth/auth.module';
import { AuthErrorHanding } from 'src/auth/authValidate.service';
import { ProfileErrorHanding } from './profiles.validate';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Profile', schema: ProfileSchema },
    ]),
    forwardRef(() => AuthModule),
    JwtModule,
    forwardRef(() => UsersModule),
  ],
  providers: [
    ProfilesService,
    ProfilesResolver,
    ProfilePipe,
    AuthErrorHanding,
    ProfileErrorHanding,
  ],
  exports: [ProfilesService, ProfileErrorHanding],
})
export class ProfilesModule {}
