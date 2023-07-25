import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Post {
  @Field(() => String) id: string;
  @Field(() => String) title: string;
  @Field(() => String) content: string;
  @Field(() => String) imageUrl: string;
}

@ObjectType()
export class Posts {
  @Field(() => [Post]) posts: Post[];
}
