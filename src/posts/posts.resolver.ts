import { ForbiddenException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Post, PostInput, Posts } from 'src/posts/datatype/post.dto';
import { PostsService } from './posts.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PostInputPipe } from './posts.pipe';
import { AuthErrorHanding } from 'src/auth/authValidate.service';
import { Request } from 'express';
import { CommentsService } from 'src/comments/comments.service';
import { LikesService } from 'src/likes/likes.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ProfilesService } from 'src/profiles/profiles.service';

@UseGuards(AuthGuard)
@Resolver()
export class PostsResolver {
  constructor(
    private readonly postSevice: PostsService,
    private readonly profileService: ProfilesService,
    private readonly commentsService: CommentsService,
    private readonly likesService: LikesService,
    private readonly notificationService: NotificationsService,
    private readonly authErrorHanding: AuthErrorHanding,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Post)
  async createPost(
    @Args(
      { name: 'PostInput', type: () => PostInput },
      new PostInputPipe(),
    )
    post: PostInput,
    @Context('req') req: Request,
  ): Promise<Post> {
    const user_id = await this.authErrorHanding.getUserIdFromHeader(
      req.headers,
    );
    const post_created = await this.postSevice.createPost(post, user_id);
    if (!post_created) {
      throw new ForbiddenException('Post creation failed');
    }
    await this.notificationService.createNotificationForNewPost(user_id);
    const { id, title, content, imageUrl } = post_created;
    return {
      id,
      title,
      content,
      imageUrl,
      comments: [],
      likesCount: 0,
    };
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async updatePost(
    @Args({ name: 'id', type: () => String }) post_id: string,
    @Args(
      { name: 'PostInput', type: () => PostInput },
      new PostInputPipe(),
    )
    post: PostInput,
    @Context('req') req: Request,
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
  @Query(() => Posts)
  async getPostsByProfileId(
    @Args({ name: 'profile_id', type: () => String }) profile_id: string,
  ): Promise<Posts> {
    const user_id = await this.profileService.throwUserIdFromProfile(
      profile_id,
    );
    if (!user_id) {
      throw new ForbiddenException('This profile does not exist');
    }
    const posts = await this.postSevice.getAllPosts(user_id);
    if (!posts) {
      throw new ForbiddenException('This profile has no posts');
    }
    const newPostsDetail = [];
    for await (const post of posts) {
      const { id, title, content, imageUrl } = post;
      const likes = await this.likesService.getLikes(post.id);
      const new_post = {
        id,
        title,
        content,
        imageUrl,
        comments: await this.commentsService.findAllComments(post.id),
        likesCount: likes.length,
      };
      newPostsDetail.push(new_post);
    }
    return { posts: newPostsDetail };
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
    const newPostsDetail = [];
    for await (const post of posts) {
      const { id, title, content, imageUrl } = post;
      const likes = await this.likesService.getLikes(post.id);
      const new_post = {
        id,
        title,
        content,
        imageUrl,
        comments: await this.commentsService.findAllComments(post.id),
        likesCount: likes.length,
      };
      newPostsDetail.push(new_post);
    }
    return { posts: newPostsDetail };
  }

  @UseGuards(AuthGuard)
  @Query(() => Posts)
  async getAllPostsInDatabase(): Promise<Posts> {
    const posts = await this.postSevice.getAllPostsInDatabase();
    if (!posts) {
      throw new ForbiddenException('This profile has no posts');
    }
    const newPostsDetail = [];
    for await (const post of posts) {
      const { id, title, content, imageUrl } = post;
      const likes = await this.likesService.getLikes(post.id);
      const new_post = {
        id,
        title,
        content,
        imageUrl,
        comments: await this.commentsService.findAllComments(post.id),
        likesCount: likes.length,
      };
      newPostsDetail.push(new_post);
    }
    return { posts: newPostsDetail };
  }
}
