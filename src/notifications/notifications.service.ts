import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationEntity } from 'src/notifications/datatype/notifications.entity';
import { NotificationDTO } from 'src/notifications/datatype/notifications.dto';
import { FollowsService } from 'src/follows/follows.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import { PostsService } from 'src/posts/posts.service';
@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel('Notification')
    private readonly notificationModel: Model<NotificationEntity>,
    private readonly postsService: PostsService,
    private readonly followsService: FollowsService,
    private readonly profilesService: ProfilesService,
  ) {}

  async createNotificationForNewPost(user_id: string): Promise<boolean> {
    const user_following = await this.followsService.findFollowerInUserId(
      user_id,
    );
    if (!user_following) return false;
    const { name } = await this.profilesService.findProfile(user_id);
    for await (const user of user_following) {
      const notification = new this.notificationModel({
        userId: user,
        body: `${name} has created a new post`,
      });
      await notification.save();
    }
    return true;
  }

  async createNotificationForNewComment(
    user_id_comment: string,
    post_id: string,
  ): Promise<boolean> {
    const { name } = await this.profilesService.findProfile(
      user_id_comment,
    );
    const post_found = await this.postsService.findPost(post_id);
    const user_id_post = post_found.userId;
    if (user_id_comment === user_id_post) return false;
    const notification = new this.notificationModel({
      userId: user_id_post,
      body: `${name} has commented on your post`,
      postId: post_id,
    });
    await notification.save();
    return true;
  }

  async createNotificationForNewLike(
    user_id_like: string,
    post_id: string,
  ): Promise<boolean> {
    const post_found = await this.postsService.findPost(post_id);
    const user_id_post = post_found.userId;
    if (user_id_like === user_id_post) return false;
    const { name } = await this.profilesService.findProfile(user_id_like);
    const notification = new this.notificationModel({
      userId: user_id_post,
      body: `${name} has liked your post`,
      postId: post_id,
    });
    await notification.save();
    return true;
  }

  async getNotifications(user_id: string): Promise<NotificationDTO[]> {
    const notifications = await this.notificationModel
      .find({ userId: user_id })
      .sort({ createdAt: -1 })
      .exec();
    notifications.forEach((notification) => {
      notification.id = notification._id;
    });
    return;
  }

  async markAsRead(user_id: string): Promise<boolean> {
    const status = await this.notificationModel.findOneAndDelete({
      userId: user_id,
    });
    return status ? true : false;
  }
}
