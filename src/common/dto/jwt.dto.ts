import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class JWT {
  @Field(() => String) access_token: string;
}
