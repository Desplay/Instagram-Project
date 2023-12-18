import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './datatype/comment.entity';
import { Comment as CommentDTO } from './datatype/comment.dto';
import { CommentEntityToDTO } from './comments.pipe';
import { ProfilesService } from 'src/profiles/profiles.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comment')
    private readonly CommentModel: Model<Comment>,
    private readonly profilesService: ProfilesService,
  ) {}

  async createComment(
    commentInput: Comment,
    user_id: string,
  ): Promise<Comment> {
    commentInput.userId = user_id;
    const newComment = new this.CommentModel(commentInput);
    return await newComment.save();
  }

  async findComment(comment_id: string): Promise<Comment> {
    const comment = await this.CommentModel.findOne({ _id: comment_id });
    return comment;
  }

  async findAllComments(post_id: string): Promise<CommentDTO[]> {
    const comments = await this.CommentModel.find({ postId: post_id });
    const new_comments: CommentDTO[] = [];
    for await (const comment of comments) {
      const profile_id = (
        await this.profilesService.findProfile(comment.userId?.toString())
      ).id;
      const newComment = new CommentEntityToDTO().transform(comment);
      newComment.profile_id = profile_id;
      new_comments.push(newComment);
    }
    return new_comments;
  }

  async deleteComment(
    comment_id: string,
    user_id: string,
  ): Promise<Comment> {
    const deletedComment = await this.CommentModel.findOneAndDelete({
      _id: comment_id,
      userId: user_id,
    });
    return deletedComment;
  }

  async updateComment(
    comment_id: string,
    body: string,
    user_id: string,
  ): Promise<Comment> {
    const updatedComment = await this.CommentModel.findOneAndUpdate(
      { _id: comment_id, userId: user_id },
      { body: body, updatedAt: Date.now() },
    );
    return updatedComment;
  }
}
