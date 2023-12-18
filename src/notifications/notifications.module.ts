import { Module, forwardRef } from '@nestjs/common';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsService } from './notifications.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { FollowsModule } from 'src/follows/follows.module';
import { NotificationSchema } from './datatype/notifications.entity';
import { PostsModule } from 'src/posts/posts.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from 'src/common/jwt/jwt.module';

@Module({
  imports: [
    ProfilesModule,
    FollowsModule,
    JwtModule,
    forwardRef(() => PostsModule),
    AuthModule,
    MongooseModule.forFeature([
      { name: 'Notification', schema: NotificationSchema },
    ]),
  ],
  providers: [NotificationsResolver, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
