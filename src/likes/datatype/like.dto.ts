import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Like {
  @Field(() => String) userIdLiked: string;
  @Field(() => Date) createdAt: Date;
}

@ObjectType()
export class Likes {
  @Field(() => [Like]) likes: Like[];
}
