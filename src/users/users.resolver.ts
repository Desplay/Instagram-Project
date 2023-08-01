import { ForbiddenException, UseGuards } from '@nestjs/common';
import { Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { UsersService } from './users.service';
import { AuthErrorHanding } from 'src/auth/auth.validate';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authErrorHanding: AuthErrorHanding,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async deactiveAccount(@Context('req') req: Request): Promise<string> {
    const user_id = await this.authErrorHanding.validateAuthorization(
      req.headers,
    );
    const user_exist = await this.authErrorHanding.validateUserExist(
      user_id,
    );
    if (user_exist.deactive) {
      throw new ForbiddenException('Account is deactived');
    }
    user_exist.deactive = true;
    const deactive_account = await this.usersService.updateUser(
      user_id,
      user_exist,
    );
    if (!deactive_account) {
      throw new ForbiddenException('Deactive account failed');
    }

    const message = 'Deactive account successfully';
    return message;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async activeAccount(@Context('req') req: Request): Promise<string> {
    const user_id = await this.authErrorHanding.validateAuthorization(
      req.headers,
    );
    const user_exist = await this.authErrorHanding.validateUserExist(
      user_id,
    );
    if (!user_exist.deactive) {
      throw new ForbiddenException('Account is actived');
    }
    user_exist.deactive = false;
    const active_account = await this.usersService.updateUser(
      user_id,
      user_exist,
    );
    if (!active_account) {
      throw new ForbiddenException('Active account failed');
    }
    const message = 'Active account successfully';
    return message;
  }
}
