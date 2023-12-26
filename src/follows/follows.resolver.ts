import { ForbiddenException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthErrorHanding } from 'src/auth/authValidate.service';
import { FollowsService } from './follows.service';
import { Follows } from './datatype/follow.dto';
import { Request } from 'express';

@Resolver()
export class FollowsResolver {
  constructor(
    private readonly authErrorHanding: AuthErrorHanding,
    private readonly followsService: FollowsService,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async FollowProfile(
    @Args({ name: 'profile_follow', type: () => String })
    profile_follow: string,
    @Context('req') req: Request,
  ): Promise<string> {
    const user_id = await this.authErrorHanding.getUserIdFromHeader(
      req.headers,
    );
    const follow_created = await this.followsService.createFollowProfile(
      user_id,
      profile_follow,
    );
    console.log(follow_created);
    if (!follow_created) {
      throw new ForbiddenException('Follow creation failed');
    }
    const message = 'Follow created successfully';
    return message;
  }

  @UseGuards(AuthGuard)
  @Query(() => Follows)
  async getFollowing(@Context('req') req: Request): Promise<Follows> {
    const user_id = await this.authErrorHanding.getUserIdFromHeader(
      req.headers,
    );
    const follows = await this.followsService.findFollowingInUserId(
      user_id,
    );
    if (!follows) {
      throw new ForbiddenException('No user is following');
    }
    return { profile_id: follows };
  }

  @UseGuards(AuthGuard)
  @Query(() => Follows)
  async getUserFollowerMyProfile(
    @Context('req') req: Request,
  ): Promise<Follows> {
    const user_id = await this.authErrorHanding.getUserIdFromHeader(
      req.headers,
    );
    const follows = await this.followsService.findFollowerInUserId(
      user_id,
    );
    if (!follows) {
      throw new ForbiddenException('No user is follow this profile');
    }
    return { profile_id: follows };
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async UnfollowProfile(
    @Context('req') req: Request,
    @Args({ name: 'profile_unfollow', type: () => String })
    profile_unfollow: string,
  ): Promise<string> {
    const user_id = await this.authErrorHanding.getUserIdFromHeader(
      req.headers,
    );
    const follow_deleted = await this.followsService.deleteFollowProfile(
      user_id,
      profile_unfollow,
    );
    if (!follow_deleted) {
      throw new ForbiddenException('Follow deletion failed');
    }
    const message = 'Follow deleted successfully';
    return message;
  }
}
