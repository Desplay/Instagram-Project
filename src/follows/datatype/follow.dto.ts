import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Follows {
  @Field(() => [String]) id: string[];
}
