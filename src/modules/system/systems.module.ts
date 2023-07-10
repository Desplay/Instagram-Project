import { Module } from '@nestjs/common';
import { MongooseModule } from './mongoose/mongoose.module';
import { GraphqlModule } from './graphql/graphql.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [MongooseModule, GraphqlModule, MailModule],
})
export class SystemsModule {}
