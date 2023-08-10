import { ForbiddenException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { PostInput, Posts, Post } from 'src/posts/datatype/post.dto';
import { PostsService } from './posts.service';
import { AuthGuard } from 'src/auth/auth.guard';

import { PostInputPipe } from './posts.pipe';
import { AuthErrorHanding } from 'src/auth/authValidate.service';
import { file } from 'googleapis/build/src/apis/file';

@UseGuards(AuthGuard)
@Resolver()
export class PostsResolver {
  constructor(
    private readonly postSevice: PostsService,
    private readonly authErrorHanding: AuthErrorHanding,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async createPost(
    @Args(
      { name: 'PostInput', type: () => PostInput },
      new PostInputPipe(),
    )
    post: PostInput,
    @Context('req')
    req: Request,
  ): Promise<string> {
    const user_id = await this.authErrorHanding.getUserIdFromHeader(
      req.headers,
    );
    const post_created = await this.postSevice.createPost(post, user_id);
    if (!post_created) {
      throw new ForbiddenException('Post creation failed');
    }
    const message = 'Post created successfully';
    return message;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Post)
  async updatePost(
    @Args({ name: 'id', type: () => String }) post_id: string,
    @Args(
      { name: 'PostInput', type: () => PostInput },
      new PostInputPipe(),
    )
    post: PostInput,
    @Context('req')
    req: Request,
  ): Promise<string> {
    const user_id = await this.authErrorHanding.getUserIdFromHeader(
      req.headers,
    );
    const post_updated = await this.postSevice.updatePost(
      user_id,
      post_id,
      post,
    );
    if (!post_updated) {
      throw new ForbiddenException('Post update failed');
    }
    const message = 'Post updated successfully';
    return message;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async deletePost(
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<string> {
    const post_deleted = await this.postSevice.deletePost(id);
    if (!post_deleted) {
      throw new ForbiddenException('Post deletion failed');
    }
    const message = 'Post deleted successfully';
    return message;
  }

  @UseGuards(AuthGuard)
  @Query(() => Post)
  async showPost(
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<Post> {
    const post = await this.postSevice.findPost(id);
    if (!post) {
      throw new ForbiddenException('Post not found');
    }
    return post;
  }

  @UseGuards(AuthGuard)
  @Query(() => Posts)
  async getAllPosts(@Context('req') req: Request): Promise<Posts> {
    const user_id = await this.authErrorHanding.getUserIdFromHeader(
      req.headers,
    );
    const posts = await this.postSevice.getAllPosts(user_id);
    if (!posts) {
      throw new ForbiddenException('This profile has no posts');
    }
    return posts;
  }
}
