import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/posts/datatype/post.entity';
import { File } from 'src/common/cloudinary/datatype/file.entity';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post') private readonly PostModel: Model<Post>,
    private readonly cloudService: CloudinaryService,
  ) {}

  // async createPost(
  //   post: Post,
  //   file: File | null,
  // ): Promise<Post | undefined> {
  //   return undefined;
  // if (file) {
  //   const url = await this.cloudService.uploadFile(file, post._id);
  //   if (!url) throw new Error('Upload file failed');
  //   post.imageUrl = url;
  // }
  // const newPost = new this.PostModel(post);
  // return await newPost.save();
  // }

  // async updatePost(
  //   id: string,
  //   post: any,
  //   file: File | null,
  // ): Promise<Post | undefined> {
  //   if (file) {
  //     if (!(await this.cloudService.deleteFile(id)))
  //       throw new Error('Delete file failed');
  //     const url = await this.cloudService.uploadFile(file, id);
  //     post.imageUrl = url;
  //   }
  //   return await this.PostModel.findByIdAndUpdate(id, post, {
  //     new: true,
  //   }).exec();
  // }

  // async deletePost(id: string): Promise<boolean> {
  //   const post = await this.PostModel.findByIdAndDelete(id);
  //   if (!post) return false;
  //   if (await this.cloudService.deleteFile(id)) return true;
  //   throw new Error('Delete file failed');
  // }

  // async findPost(id: string): Promise<Post | undefined> {
  //   return await this.PostModel.findById(id).exec();
  // }

  // async getAllPosts(user_id: string): Promise<Post[] | undefined> {
  //   return await this.PostModel.find()
  //     .where('userId')
  //     .equals(user_id)
  //     .exec();
  // }
}
