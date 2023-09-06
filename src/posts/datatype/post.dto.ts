import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { Comment } from 'src/comments/datatype/comment.dto';

@ObjectType()
export class PostDTO {
  @Field(() => String) id: string;
  @Field(() => String) title: string;
  @Field(() => String) content: string;
  @Field(() => String, { nullable: true }) imageUrl?: string;
}

@ObjectType()
export class Post extends PostDTO {
  @Field(() => [Comment]) comments: Comment[];
  @Field(() => Number) likesCount: number;
}
@ObjectType()
export class Posts {
  @Field(() => [Post]) posts: Post[];
}

@InputType()
export class PostInput {
  @Field(() => String) title: string;
  @Field(() => String) content: string;
  @Field(() => GraphQLUpload, { nullable: true }) Image: FileUpload;
}
