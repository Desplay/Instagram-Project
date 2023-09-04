import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDTO, PostInput } from 'src/posts/datatype/post.dto';
import { PostEntity } from './datatype/post.entity';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { PostDTOToEntity } from './posts.pipe';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post') private readonly PostModel: Model<PostEntity>,
    private readonly cloudService: CloudinaryService,
  ) {}

  async createPost(post: PostInput, user_id: string): Promise<boolean> {
    const file = await post.Image;
    const Post = new PostDTOToEntity().transform(post);
    Post.userId = user_id;
    const newPost = await new this.PostModel(Post).save();
    const newPostId = newPost._id.toString();
    if (file) {
      const url = await this.cloudService.uploadFile(file, newPostId);
      if (!url) return false;
      newPost.imageUrl = url;
    }
    await newPost.save();
    return true;
  }

  async updatePost(
    user_id: string,
    post_id: string,
    post: PostInput,
  ): Promise<PostDTO> {
    const file = await post.Image;
    const new_post = new PostDTOToEntity().transform(post);
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

  async findPost(id: string): Promise<PostDTO> {
    return await this.PostModel.findById(id);
  }

  async getAllPosts(user_id: string): Promise<PostDTO[]> {
    const posts_found = await this.PostModel.find()
      .where('userId')
      .equals(user_id);
    if (posts_found.length === 0) return undefined;
    const posts = posts_found.map((post) => {
      const { _id, title, content, imageUrl } = post;
      return { id: _id.toString(), title, content, imageUrl };
    });
    return posts;
  }
}
