import { Module, forwardRef } from '@nestjs/common';
import { JwtModule as JWT } from '@nestjs/jwt';
import { JwtService } from './jwt.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JWT.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
      }),
    }),
  ],
  providers: [JwtService],
  exports: [JWT, JwtService],
})
export class JwtModule {}
