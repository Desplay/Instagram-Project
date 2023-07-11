import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './modules/modules.module';

@Module({
  imports: [AuthModule, ServicesModule],
})
export class AppModule {}
