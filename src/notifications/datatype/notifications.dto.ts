import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NotificationDTO {
  @Field(() => String)
  id: string;
  @Field(() => String)
  userId: string;
  @Field(() => String)
  body: string;
  @Field(() => String)
  postId: string;
}
