import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesService } from './profiles.service';
import { ProfileSchema } from './datatype/profile.entity';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '../common/jwt/jwt.module';
import { ProfilePipe } from './profiles.pipe';
import { AuthModule } from 'src/auth/auth.module';
import { AuthErrorHanding } from 'src/auth/authValidate.service';
import { ProfileErrorHanding } from './profilesValidate.service';
import { ProfilesResolver } from './profiles.resolver';

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
    ProfilePipe,
    ProfilesResolver,
    AuthErrorHanding,
    ProfileErrorHanding,
  ],
  exports: [ProfilesService, ProfileErrorHanding],
})
export class ProfilesModule {}
