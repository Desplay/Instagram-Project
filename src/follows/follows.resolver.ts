import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/auth.guard';
@Resolver()
export class FollowsResolver {
  // @UseGuards(AuthGuard)
  // @Mutation(() => String)
  // async createFollow(
  //   @Args({ name: 'user_follow', type: () => String }) user_follow: string,
  //   @Context('req') req: Request,
  // ): Promise<string> {}
}
