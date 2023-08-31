import { Module } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { FollowsResolver } from './follows.resolver';
import { UsersModule } from '../users/users.module';
import { FollowSchema } from './datatype/follow.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthErrorHanding } from 'src/auth/authValidate.service';
import { JwtModule } from 'src/common/jwt/jwt.module';
import { ProfilesModule } from 'src/profiles/profiles.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: 'Follow', schema: FollowSchema }]),
    JwtModule,
    ProfilesModule,
  ],
  providers: [FollowsService, FollowsResolver, AuthErrorHanding],
})
export class FollowsModule {}
