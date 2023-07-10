import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './modules/modules.module';

@Module({
  imports: [UsersModule, AuthModule, ServicesModule],
})
export class AppModule {}
