import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostInput, Posts } from 'src/posts/datatype/post.dto';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { PostTransformPipe } from './posts.pipe';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post') private readonly PostModel: Model<Post>,
    private readonly cloudService: CloudinaryService,
  ) {}

  async createPost(post: PostInput, user_id: string): Promise<Post> {
    const file = await post.Image;
    const Post = new PostTransformPipe().transform(post);
    Post.userId = user_id;
    const newPost = await new this.PostModel(Post).save();
    const newPostId = newPost.id;
    if (file) {
      const url = await this.cloudService.uploadFile(file, newPostId);
      if (!url) return undefined;
      newPost.imageUrl = url;
    }
    return await newPost.save();
  }

  async updatePost(
    user_id: string,
    post_id: string,
    post: PostInput,
  ): Promise<Post> {
    const file = await post.Image;
    const new_post = new PostTransformPipe().transform(post);
    new_post.userId = user_id;
    if (file) {
      if (!(await this.cloudService.deleteFile(post_id))) {
        return undefined;
      }
      const url = await this.cloudService.uploadFile(file, post_id);
      new_post.imageUrl = url;
    }
    return await this.PostModel.findByIdAndUpdate(post_id, new_post);
  }

  async deletePost(id: string): Promise<boolean> {
    const post = await this.PostModel.findByIdAndDelete(id);
    if (!post) return false;
    const status = await this.cloudService.deleteFile(id);
    return status ? true : false;
  }

  async findPost(id: string): Promise<Post> {
    return await this.PostModel.findById(id);
  }

  async getAllPosts(user_id: string): Promise<Posts> {
    const posts = await this.PostModel.find()
      .where('userId')
      .equals(user_id);
    if (posts.length === 0) return undefined;
    const posts_type: string[] = posts.map((post) => {
      return post.id;
    });
    return { posts: posts_type };
  }
}
