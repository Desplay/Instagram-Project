import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendMail(userEmail: string, otpCode: any): Promise<any> {
    await this.mailerService.sendMail({
      to: userEmail,
      from: '<noreply>desplayshido@gmail.com',
      subject: 'Verify your account',
      html: `your OTP code is: ${otpCode}, \n OTP code will be expired in 5 minutes`,
    });
  }
}
