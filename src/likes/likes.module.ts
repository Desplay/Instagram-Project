import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikesService } from './likes.service';
import { LikesResolver } from './likes.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Like', schema: LikesService }]),
  ],
  providers: [LikesService, LikesResolver],
})
export class LikesModule {}
