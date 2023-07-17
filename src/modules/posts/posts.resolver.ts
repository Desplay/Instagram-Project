import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { Post, Posts } from 'src/data/dto/post.dto';
import { PostsService } from './posts.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '../systems/jwt/jwt.service';
import { PostModel } from 'src/data/entity/post.entity';

@Resolver()
export class PostsResolver {
  constructor(private readonly postSevice: PostsService, private readonly jwtService: JwtService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Post)
  async createPost(
    @Args({ name: 'title', type: () => String }) title: string,
    @Args({ name: 'content', type: () => String }) content: string,
    @Args({ name: 'file', type: () => GraphQLUpload, nullable: true })
    file: FileUpload,
    @Context('req') req: Request,
  ): Promise<Post> {
    const access_token = req.headers['access_token'];
    const payload = await this.jwtService.verifyToken(access_token);
    const user_id = payload['user_id'];
    if (!user_id) throw new Error('User not found');
    const newPost = new PostModel({
      title: title,
      content: content,
      imageUrl: '',
      userId: user_id,
    });
    const post = await this.postSevice.createPost(newPost, file);
    if (!post) throw new Error(`'Post creation failed`);
    return post;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Post)
  async updatePost(
    @Args({ name: 'id', type: () => String }) id: string,
    @Args({ name: 'title', type: () => String }) title: string,
    @Args({ name: 'content', type: () => String }) content: string,
    @Args({ name: 'file', type: () => GraphQLUpload, nullable: true })
    file: FileUpload,
    @Context('req') req: Request,
  ): Promise<Post> {
    const access_token = req.headers['access_token'];
    const payload = await this.jwtService.verifyToken(access_token);
    const user_id = payload['user_id'];
    if (!user_id) throw new Error('User not found');
    const newPost = {
      title: title,
      content: content,
      imageUrl: '',
    };
    const post = await this.postSevice.updatePost(id, newPost, file);
    if (!post) throw new Error('Post updated failed');
    return post;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async deletePost(@Args({ name: 'id', type: () => String }) id: string): Promise<string> {
    try {
      await this.postSevice.deletePost(id);
      return 'Post deleted successfully';
    } catch (error) {
      throw new Error('Post delete failed');
    }
  }

  @UseGuards(AuthGuard)
  @Query(() => Posts)
  async getAllPosts(@Context('req') req: Request): Promise<Post[]> {
    const access_token = req.headers['access_token'];
    const payload = await this.jwtService.verifyToken(access_token);
    const user_id = payload['user_id'];
    const posts = await this.postSevice.getAllPosts(user_id);
    return posts;
  }
}
