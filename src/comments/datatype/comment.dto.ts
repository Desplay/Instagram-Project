import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ObjectType()
export class Comment {
  @Field(() => String) id: string;
  @Field(() => String, { nullable: true }) reply_id: string;
  @Field(() => String) post_id: string;
  @Field(() => String) profile_id: string;
  @Field(() => String) body: string;
  @Field(() => Date) created_at: Date;
  @Field(() => Date) updated_at: Date;
}

@ObjectType()
export class Comments {
  @Field(() => [Comment]) comments: Comment[];
}

@InputType()
export class CommentInput {
  @IsNotEmpty()
  @Field(() => String)
  post_id: string;

  @IsNotEmpty()
  @Field(() => String)
  body: string;

  @Field(() => String, { defaultValue: null, nullable: true })
  replyCommenId?: string;
}
