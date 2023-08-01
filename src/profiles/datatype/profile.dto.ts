import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Profile {
  @Field(() => String) name: string;
  @Field(() => Date, { nullable: true }) birthday: Date;
  @Field(() => Int, { nullable: true }) age: number;
  @Field(() => String, { nullable: true }) description: string;
}

@ObjectType()
export class Profiles {
  @Field(() => [Profile]) profiles: Profile[];
}

@InputType()
export class ProfileInput {
  @Field(() => String) name: string;
  @Field(() => Date) birthday: Date;
  @Field(() => Int) age: number;
  @Field(() => String) description: string;
}
