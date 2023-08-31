import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@ObjectType()
export class Post {
  @Field(() => String) id: string;
  @Field(() => String) title: string;
  @Field(() => String) content: string;
  @Field(() => String, { nullable: true }) imageUrl?: string;
}

@ObjectType()
export class Posts {
  @Field(() => [String]) posts: string[];
}

@InputType()
export class PostInput {
  @Field(() => String) title: string;
  @Field(() => String) content: string;
  @Field(() => GraphQLUpload, { nullable: true }) Image: FileUpload;
}
