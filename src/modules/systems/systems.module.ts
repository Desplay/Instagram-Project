import { Module } from '@nestjs/common';
import { MongooseModule } from './mongoose/mongoose.module';
import { GraphqlModule } from './graphql/graphql.module';
import { MailModule } from './mail/mail.module';
import { GcpModule } from './gcp/gcp.module';

@Module({
  imports: [MongooseModule, GraphqlModule, MailModule, GcpModule],
})
export class SystemsModule {}
