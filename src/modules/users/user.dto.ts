// Schema for GraphQL

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => String) name: string;
  @Field(() => String) email: string;
  @Field(() => String) password: string;
}
