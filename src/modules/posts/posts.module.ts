import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from 'src/data/entity/post.entity';
import { JwtModule } from '../systems/jwt/jwt.module';
import { GcpModule } from '../systems/gcp/gcp.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]), JwtModule, GcpModule],
  providers: [PostsService, PostsResolver],
})
export class PostsModule {}
