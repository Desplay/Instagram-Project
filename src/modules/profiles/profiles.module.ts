import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProfilesService } from './profiles.service';
import { ProfilesResolver } from './profiles.resolver';
import { ProfileSchema } from './profiles.entity';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '../system/jwt/jwt.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema }]), JwtModule, UsersModule],
  providers: [ProfilesService, ProfilesResolver],
})
export class ProfilesModule {}
