import { Module } from '@nestjs/common';
import { MongooseModule as Mongoose } from '@nestjs/mongoose';

@Module({
  imports: [Mongoose.forRoot('mongodb://localhost:27017/MongoDB_NestJS_GraphQL')],
})
export class MongooseModule {}
