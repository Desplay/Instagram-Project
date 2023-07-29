import { Module } from '@nestjs/common';
import { MongooseModule as Mongoose } from '@nestjs/mongoose';

@Module({
  imports: [
    Mongoose.forRootAsync({
      useFactory: () => ({
        uri: process.env.DATABASE_URL || process.env.MONGODB_URI,
      }),
    }),
  ],
})
export class MongooseModule {}
