import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './users.service';
import { UserSchema } from '../../data/entity/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtModule } from '../systems/jwt/jwt.module';

@Module({
  imports: [forwardRef(() => JwtModule), MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UsersService, AuthGuard],
  exports: [UsersService],
})
export class UsersModule {}
