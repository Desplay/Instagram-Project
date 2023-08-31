import { Injectable, PipeTransform } from '@nestjs/common';
import {
  CommentInput,
  Comment as CommentDTO,
} from './datatype/comment.dto';
import { Comment } from './datatype/comment.entity';

@Injectable()
export class CommentsPipe implements PipeTransform {
  transform(value: CommentInput): Comment {
    const { post_id, body, replyCommenId } = value;
    return {
      postId: post_id,
      body,
      reCommentId: replyCommenId,
      userId: null,
    };
  }
}

@Injectable()
export class CommentEntityToDTO implements PipeTransform {
  transform(value: any): CommentDTO {
    const {
      reCommentId,
      _id,
      postId,
      userId,
      body,
      createdAt,
      updatedAt,
    } = value;
    const newComment: CommentDTO = {
      id: _id.toString(),
      reply_id: reCommentId ? reCommentId.toString() : null,
      post_id: postId.toString(),
      user_id: userId.toString(),
      body,
      created_at: createdAt,
      updated_at: updatedAt,
    };
    return newComment;
  }
}

export class CommentsPipeModule {
  static CommentsPipe = CommentsPipe;
  static CommentEntityToDTO = CommentEntityToDTO;
}
