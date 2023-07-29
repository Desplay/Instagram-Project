import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { Post, Posts } from 'src/posts/datatype/post.dto';
import { PostsService } from './posts.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '../common/jwt/jwt.service';
import { PostModel } from 'src/posts/datatype/post.entity';

@UseGuards(AuthGuard)
@Resolver()
export class PostsResolver {
  // constructor(
  //   private readonly postSevice: PostsService,
  //   private readonly jwtService: JwtService,
  // ) {}
  // @UseGuards(AuthGuard)
  // @Mutation(() => Post)
  // async createPost(
  //   @Args({ name: 'title', type: () => String }) title: string,
  //   @Args({ name: 'content', type: () => String }) content: string,
  //   @Args({ name: 'file', type: () => GraphQLUpload, nullable: true })
  //   file: FileUpload,
  //   @Context('req') req: Request,
  // ): Promise<Post> {
  //   const payload = await this.jwtService.extractToken(
  //     req.headers['access_token'],
  //   );
  //   const user_id = payload['user_id'];
  //   const newPost = new PostModel({
  //     title: title,
  //     content: content,
  //     imageUrl: '',
  //     userId: user_id,
  //   });
  //   const post = await this.postSevice.createPost(newPost, file);
  //   if (!post) throw new Error(`'Post creation failed`);
  //   return post;
  // }
  // @UseGuards(AuthGuard)
  // @Mutation(() => Post)
  // async updatePost(
  //   @Args({ name: 'id', type: () => String }) id: string,
  //   @Args({ name: 'title', type: () => String }) title: string,
  //   @Args({ name: 'content', type: () => String }) content: string,
  //   @Args({ name: 'file', type: () => GraphQLUpload, nullable: true })
  //   file: FileUpload,
  // ): Promise<Post> {
  //   const newPost = {
  //     title: title,
  //     content: content,
  //     imageUrl: '',
  //   };
  //   const post = await this.postSevice.updatePost(id, newPost, file);
  //   if (!post) throw new Error('Post updated failed');
  //   return post;
  // }
  // @Mutation(() => String)
  // async deletePost(
  //   @Args({ name: 'id', type: () => String }) id: string,
  // ): Promise<string> {
  //   if (!(await this.postSevice.deletePost(id)))
  //     throw new Error('Post delete failed');
  //   return 'Post deleted successfully';
  // }
  // @UseGuards(AuthGuard)
  // @Query(() => Post)
  // async getPost(
  //   @Args({ name: 'id', type: () => String }) id: string,
  // ): Promise<Post> {
  //   const post = await this.postSevice.findPost(id);
  //   if (!post) throw new Error('Post not found');
  //   return post;
  // }
  // @UseGuards(AuthGuard)
  // @Query(() => Posts)
  // async getAllPosts(@Context('req') req: Request): Promise<Posts> {
  //   const payload = await this.jwtService.extractToken(
  //     req.headers['access_token'],
  //   );
  //   const user_id = payload['user_id'];
  //   const posts: Post[] = await this.postSevice.getAllPosts(user_id);
  //   if (!posts) throw new Error('This user has no posts');
  //   return { posts: posts };
  // }
}
