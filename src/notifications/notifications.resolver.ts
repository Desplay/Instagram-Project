import { Context, Query, Resolver } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { AuthErrorHanding } from 'src/auth/authValidate.service';
import { NotificationDTO } from './datatype/notifications.dto';

@Resolver()
export class NotificationsResolver {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly authErrorHanding: AuthErrorHanding,
  ) {}

  @Query(() => [NotificationDTO])
  async getNotifications(@Context('req') req: Request) {
    const user_id = await this.authErrorHanding.getUserIdFromHeader(
      req.headers,
    );
    return await this.notificationsService.getNotifications(user_id);
  }

  @Query(() => Boolean)
  async markAsRead(@Context('req') req: Request) {
    const user_id = await this.authErrorHanding.getUserIdFromHeader(
      req.headers,
    );
    return await this.notificationsService.markAsRead(user_id);
  }
}
