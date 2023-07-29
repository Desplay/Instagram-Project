import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload';
import * as csurf from 'csurf';

async function bootstrap() {
  const post = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));
  app;
  await app.listen(post);
  app.use(csurf());
}
bootstrap();
