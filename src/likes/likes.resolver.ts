import { ForbiddenException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/auth.guard';
import { LikesService } from './likes.service';
import { Request } from 'express';
import { AuthErrorHanding } from 'src/auth/authValidate.service';
import { Likes } from './datatype/like.dto';

@UseGuards(AuthGuard)
@Resolver()
export class LikesResolver {
  constructor(
    private readonly likesService: LikesService,
    private readonly authErrorHanding: AuthErrorHanding,
  ) {}

  @Mutation(() => String)
  async likePost(
    @Args({ name: 'PostId', type: () => String }) post_id: string,
    @Context('req') req: Request,
  ): Promise<string> {
    const user_id_liked = await this.authErrorHanding.getUserIdFromHeader(
      req.headers,
    );
    const like_created = await this.likesService.createLike(
      post_id,
      user_id_liked,
    );
    if (!like_created) {
      throw new ForbiddenException('Like creation failed');
    }
    const message = 'Like created successfully';
    return message;
  }

  @Mutation(() => String)
  async unlikePost(
    @Args({ name: 'PostId', type: () => String }) post_id: string,
    @Context('req') req: Request,
  ): Promise<string> {
    const user_id_liked = await this.authErrorHanding.getUserIdFromHeader(
      req.headers,
    );
    const like_deleted = await this.likesService.deleteLike(
      post_id,
      user_id_liked,
    );
    if (!like_deleted) {
      throw new ForbiddenException('Like deletion failed');
    }
    const message = 'Like deleted successfully';
    return message;
  }

  @Query(() => Likes)
  async getLikes(
    @Args({ name: 'PostId', type: () => String }) post_id: string,
  ): Promise<Likes> {
    const likes = await this.likesService.getLikes(post_id);
    if (!likes) {
      throw new ForbiddenException('No likes found');
    }
    return { likes };
  }
}
