import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProfilesService } from './profiles.service';
import { ProfilesResolver } from './profiles.resolver';
import { ProfileSchema } from '../../data/entity/profile.entity';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '../systems/jwt/jwt.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema }]), JwtModule, UsersModule],
  providers: [ProfilesService, ProfilesResolver],
  exports: [ProfilesService],
})
export class ProfilesModule {}
