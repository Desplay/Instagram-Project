import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { GG_Account_Mail } from 'src/config/gg_mail_account.config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          // your personal gmail account
          // config in src/config/gg_mail_account.config.ts
          user: GG_Account_Mail.user,
          pass: GG_Account_Mail.pass,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
