import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  const post = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));
  await app.listen(post);
}
bootstrap();
