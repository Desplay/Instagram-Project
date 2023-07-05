import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
<<<<<<< Updated upstream
import { UserSchema } from './user.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UsersResolver, UsersService],
=======
<<<<<<< Updated upstream
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UsersResolver, UsersService, AuthService],
  controllers: [UsersController],
=======
import { UserSchema } from './user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtModule } from '../system/jwt/jwt.module';

@Module({
  imports: [JwtModule, MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UsersResolver, UsersService, AuthGuard],
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  exports: [UsersService],
})
export class UsersModule {}
