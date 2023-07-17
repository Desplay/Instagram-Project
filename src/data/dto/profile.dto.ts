import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Profile {
  @Field(() => String) name: string;
  @Field(() => Date) birthday: Date;
  @Field(() => Int) age: number;
  @Field(() => String) description: string;
}
