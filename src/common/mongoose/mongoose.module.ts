import { Module } from '@nestjs/common';
import { MongooseModule as Mongoose } from '@nestjs/mongoose';
import { MongooseService } from './mongoose.service';

@Module({
  imports: [
    Mongoose.forRootAsync({
      useFactory: () => ({
        uri: process.env.DATABASE_URL || process.env.MONGODB_URI,
      }),
    }),
  ],
  providers: [MongooseService],
})
export class MongooseModule {}
