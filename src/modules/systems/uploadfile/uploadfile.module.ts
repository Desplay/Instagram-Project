import { Module } from '@nestjs/common';
import { UploadfileService } from './uploadfile.service';
import { UploadfileResolver } from './uploadfile.resolver';
import { GraphqlModule } from '../graphql/graphql.module';

@Module({
  imports: [GraphqlModule],
  providers: [UploadfileService, UploadfileResolver],
})
export class UploadfileModule {}
