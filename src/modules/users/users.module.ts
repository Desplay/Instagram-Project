import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { UserSchema } from './user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtModule } from '../system/jwt/jwt.module';

@Module({
  imports: [JwtModule, MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UsersResolver, UsersService, AuthGuard],
  exports: [UsersService],
})
export class UsersModule {}
