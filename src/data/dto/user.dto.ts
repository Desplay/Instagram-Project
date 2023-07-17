// Schema for GraphQL

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => String, { nullable: true }) username: string;
  @Field(() => String, { nullable: true }) email: string;
}
