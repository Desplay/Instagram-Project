import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from 'src/common/entity/post.entity';
import { JwtModule } from '../systems/jwt/jwt.module';
import { CloudinaryModule } from '../systems/cloudinary/cloudinary.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]), JwtModule, CloudinaryModule],
  providers: [PostsService, PostsResolver],
})
export class PostsModule {}
