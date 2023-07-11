import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UploadfileService } from './uploadfile.service';
import { UploadfileResolver } from './uploadfile.resolver';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { graphqlUploadExpress } from 'graphql-upload';

@Module({
  providers: [UploadfileService, UploadfileResolver],
})
export class UploadfileModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(graphqlUploadExpress()).forRoutes({ path: 'graphql', method: RequestMethod.POST });
  }
}
