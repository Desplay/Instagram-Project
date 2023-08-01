import { Module, forwardRef } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { AuthGuard } from './auth.guard';
import { JwtModule } from 'src/common/jwt/jwt.module';
import { MailModule } from 'src/common/mail/mail.module';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { AuthPipe } from './auth.pipe';
import { AuthErrorHanding } from './auth.validate';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => ProfilesModule),
    JwtModule,
    MailModule,
  ],
  providers: [
    AuthService,
    AuthResolver,
    AuthPipe,
    AuthGuard,
    AuthErrorHanding,
  ],
  exports: [AuthService, AuthGuard, AuthErrorHanding],
})
export class AuthModule {}
