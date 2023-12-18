import { Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { AuthErrorHanding } from 'src/auth/authValidate.service';
import { Notification } from './datatype/notifications.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Resolver()
export class NotificationsResolver {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly authErrorHanding: AuthErrorHanding,
  ) {}

  @Query(() => [Notification])
  async getNotifications(@Context('req') req: Request) {
    const user_id = await this.authErrorHanding.getUserIdFromHeader(
      req.headers,
    );
    console.log(await this.notificationsService.getNotifications(user_id));
    return await this.notificationsService.getNotifications(user_id);
  }

  @Mutation(() => Boolean)
  async markAsRead(@Context('req') req: Request) {
    const user_id = await this.authErrorHanding.getUserIdFromHeader(
      req.headers,
    );
    return await this.notificationsService.markAsRead(user_id);
  }
}
