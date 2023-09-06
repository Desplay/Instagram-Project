import { Module } from '@nestjs/common';
import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './datatype/comment.entity';
import { UsersModule } from 'src/users/users.module';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from 'src/common/jwt/jwt.module';
import { CommentsPipeModule } from './comments.pipe';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    UsersModule,
    ProfilesModule,
    AuthModule,
    JwtModule,
    NotificationsModule,
    MongooseModule.forFeature([
      { name: 'Comment', schema: CommentSchema },
    ]),
  ],
  providers: [CommentsResolver, CommentsService, CommentsPipeModule],
  exports: [CommentsService],
})
export class CommentsModule {}
