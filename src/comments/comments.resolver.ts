import { ForbiddenException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthErrorHanding } from 'src/auth/authValidate.service';
import { CommentInput, Comment } from './datatype/comment.dto';
import { CommentsService } from './comments.service';
import { CommentEntityToDTO, CommentsPipe } from './comments.pipe';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Request } from 'express';
import { ProfilesService } from 'src/profiles/profiles.service';

@Resolver()
export class CommentsResolver {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly authErrorHanding: AuthErrorHanding,
    private readonly notificationService: NotificationsService,
    private readonly profileService: ProfilesService,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Comment)
  async commentInPost(
    @Args({ name: 'Comment', type: () => CommentInput })
    comment: CommentInput,
    @Context('req') req: Request,
  ): Promise<Comment> {
    const user_id = await this.authErrorHanding.getUserIdFromHeader(
      req.headers,
    );
    const { replyCommenId } = comment;
    if (replyCommenId) {
      const comment_found = await this.commentsService.findComment(
        replyCommenId,
      );
      const { reCommentId } = comment_found;
      if (reCommentId) {
        throw new ForbiddenException('Reply comment failed');
      }
    }
    const newComment = await this.commentsService.createComment(
      new CommentsPipe().transform(comment),
      user_id,
    );
    if (!newComment) throw new ForbiddenException('Comment failed');
    await this.notificationService.createNotificationForNewComment(
      user_id,
      newComment.postId.toString(),
    );
    const commentReturn = new CommentEntityToDTO().transform(newComment);
    commentReturn.profile_id = (
      await this.profileService.findProfile(newComment.userId.toString())
    ).id;
    return commentReturn;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async deleteComment(
    @Args({ name: 'comment_id', type: () => String }) comment_id: string,
    @Context('req') req: Request,
  ): Promise<string> {
    const user_id = await this.authErrorHanding.getUserIdFromHeader(
      req.headers,
    );
    const deletedComment = await this.commentsService.deleteComment(
      comment_id,
      user_id,
    );
    if (!deletedComment) throw new ForbiddenException('Delete failed');
    const message = 'Delete successfully';
    return message;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Comment)
  async updateComment(
    @Args({ name: 'comment_id', type: () => String }) comment_id: string,
    @Args({ name: 'body', type: () => String }) body: string,
    @Context('req') req: Request,
  ): Promise<string> {
    const user_id = await this.authErrorHanding.getUserIdFromHeader(
      req.headers,
    );
    const updatedComment = await this.commentsService.updateComment(
      comment_id,
      body,
      user_id,
    );
    if (!updatedComment) throw new ForbiddenException('Update failed');
    const message = 'Update successfully';
    return message;
  }
}
