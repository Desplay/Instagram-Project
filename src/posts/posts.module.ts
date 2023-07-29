import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from 'src/posts/datatype/post.entity';
import { JwtModule } from '../common/jwt/jwt.module';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';
import { AuthErrorHanding } from 'src/auth/auth.validate';
import { UsersModule } from 'src/users/users.module';
import { ProfilesModule } from 'src/profiles/profiles.module';

@Module({
  imports: [
    UsersModule,
    ProfilesModule,
    MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
    JwtModule,
    CloudinaryModule,
  ],
  providers: [PostsService, PostsResolver, AuthErrorHanding],
})
export class PostsModule {}
