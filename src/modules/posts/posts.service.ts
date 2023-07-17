import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GcpService } from '../systems/gcp/gcp.service';
import { Post } from 'src/data/entity/post.entity';
import { File } from 'src/data/entity/file.entity';

@Injectable()
export class PostsService {
  constructor(@InjectModel('Post') private readonly PostModel: Model<Post>, private readonly gcpService: GcpService) {}

  async createPost(post: Post, file: File | null): Promise<Post | undefined> {
    if (file) {
      const url = await this.gcpService.uploadFile(file, post._id);
      post.imageUrl = url;
    }
    const newPost = new this.PostModel(post);
    return await newPost.save();
  }

  async updatePost(id: string, post: any, file: File | null): Promise<Post | undefined> {
    if (file) {
      const url = await this.gcpService.uploadFile(file, id);
      post.imageUrl = url;
    }
    return await this.PostModel.findByIdAndUpdate(id, post, { new: true });
  }

  async deletePost(id: string): Promise<boolean> {
    const post = await this.PostModel.findByIdAndDelete(id);
    if (!post) return false;
    try {
      await this.gcpService.deleteFile(id);
    } catch (error) {
      throw new Error(`Delete file failed, error code: ${error.code}`);
    }
    return true;
  }

  async findPost(id: string): Promise<Post | undefined> {
    return await this.PostModel.findById(id).exec();
  }

  async getAllPosts(user_id: string): Promise<Post[] | undefined> {
    return await this.PostModel.find().where('userId').equals(user_id).exec();
  }
}
