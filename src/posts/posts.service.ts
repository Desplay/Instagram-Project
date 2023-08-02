import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostInput } from 'src/posts/datatype/post.dto';
import { File } from 'src/common/cloudinary/datatype/file.entity';
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
    const newPost = new this.PostModel(Post);
    const newPostId = newPost.id;
    if (file) {
      const url = await this.cloudService.uploadFile(file, newPostId);
      if (!url) return undefined;
      newPost.imageUrl = url;
    }
    return await newPost.save();
  }

  async updatePost(id: string, post: Post, file: File): Promise<Post> {
    if (file) {
      if (!(await this.cloudService.deleteFile(id))) {
        return undefined;
      }
      const url = await this.cloudService.uploadFile(file, id);
      post.imageUrl = url;
    }
    return await this.PostModel.findByIdAndUpdate(id, post);
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

  async getAllPosts(user_id: string): Promise<Post[]> {
    const posts = await this.PostModel.find()
      .where('userId')
      .equals(user_id)
      .exec();
    return posts.length > 0 ? posts : undefined;
  }
}
