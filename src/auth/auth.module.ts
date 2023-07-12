import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthGuard } from './auth.guard';
import { JwtModule } from 'src/modules/systems/jwt/jwt.module';
import { MailModule } from 'src/modules/systems/mail/mail.module';
import { ProfilesModule } from 'src/modules/profiles/profiles.module';

@Module({
  imports: [UsersModule, ProfilesModule, JwtModule, MailModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [AuthService, AuthResolver, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
