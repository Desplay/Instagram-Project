import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like as LikeEntity } from './datatype/like.entity';
import { LikesEntityToDTO } from './lipes.pipe';
import { Like } from './datatype/like.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel('Like')
    private readonly LikeModel: Model<LikeEntity>,
  ) {}

  async createLike(postid: string, userid: string): Promise<Like> {
    const newLike = new this.LikeModel({
      postId: postid,
      userIdLiked: userid,
    });
    const { userIdLiked, createdAt } = await newLike.save();
    const like: Like = {
      userIdLiked: userIdLiked.toString(),
      createdAt: createdAt,
    };
    return like;
  }

  async getLikes(postId: string): Promise<Like[]> {
    const likes = await this.LikeModel.find()
      .where('postId')
      .equals(postId);
    if (likes.length === 0) return [];
    const new_likes: Like[] = [];
    likes.map((like) => {
      const new_like: Like = new LikesEntityToDTO().transform(like);
      new_likes.push(new_like);
    });
    return new_likes;
  }

  async deleteLike(postId: string, userIdLiked: string): Promise<boolean> {
    const like = await this.LikeModel.findOneAndDelete()
      .where('postId')
      .equals(postId)
      .where('userIdLiked')
      .equals(userIdLiked);
    if (!like) return false;
    return true;
  }
}
