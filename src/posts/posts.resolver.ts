import { ForbiddenException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { PostInput } from 'src/posts/datatype/post.dto';
import { PostsService } from './posts.service';
import { AuthGuard } from 'src/auth/auth.guard';

import { PostInputPipe } from './posts.pipe';
import { AuthErrorHanding } from 'src/auth/auth.validate';

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
    const user_id = await this.authErrorHanding.validateAuthorization(
      req.headers,
    );
    const post_created = await this.postSevice.createPost(post, user_id);
    if (!post_created) {
      throw new ForbiddenException('Post creation failed');
    }
    const message = 'Post created successfully';
    return message;
  }

  // @UseGuards(AuthGuard)
  // @Mutation(() => Post)
  // async updatePost(
  // ): Promise<Post> {}

  // @UseGuards(AuthGuard)
  // @Mutation(() => String)
  // async deletePost(
  //   @Args({ name: 'id', type: () => String }) id: string,
  // ): Promise<string> {}

  // @UseGuards(AuthGuard)
  // @Query(() => Post)
  // async getPost(
  //   @Args({ name: 'id', type: () => String }) id: string,
  // ): Promise<Post> {}

  // @UseGuards(AuthGuard)
  // @Query(() => Posts)
  // async getAllPosts(@Context('req') req: Request): Promise<Posts> {}
}
