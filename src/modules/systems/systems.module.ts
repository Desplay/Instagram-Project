import { Module } from '@nestjs/common';
import { MongooseModule } from './mongoose/mongoose.module';
import { GraphqlModule } from './graphql/graphql.module';
import { MailModule } from './mail/mail.module';
import { UploadfileModule } from './uploadfile/uploadfile.module';

@Module({
  imports: [MongooseModule, GraphqlModule, MailModule, UploadfileModule],
})
export class SystemsModule {}
