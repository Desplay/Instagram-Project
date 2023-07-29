import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Authorization {
  @Field(() => String) authorization: string;
}
