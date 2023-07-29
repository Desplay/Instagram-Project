import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProfilesService } from './profiles.service';
import { ProfilesResolver } from './profiles.resolver';
import { ProfileSchema } from './datatype/profile.entity';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '../common/jwt/jwt.module';
import { ProfilePipe } from './profiles.pipe';
import { AuthModule } from 'src/auth/auth.module';
import { AuthErrorHanding } from 'src/auth/auth.validate';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Profile', schema: ProfileSchema },
    ]),
    forwardRef(() => AuthModule),
    JwtModule,
    UsersModule,
  ],
  providers: [
    ProfilesService,
    ProfilesResolver,
    ProfilePipe,
    AuthErrorHanding,
  ],
  exports: [ProfilesService],
})
export class ProfilesModule {}
