import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProfilesService } from './profiles.service';
import { Profile, ProfileInput, Profiles } from './datatype/profile.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ForbiddenException, UseGuards } from '@nestjs/common';
import { ProfileInputPipe } from './profiles.pipe';
import { AuthErrorHanding } from 'src/auth/auth.validate';
import { Request } from 'express';
import { ProfileErrorHanding } from './profiles.validate';
import { UsersService } from 'src/users/users.service';

@Resolver()
export class ProfilesResolver {
  constructor(
    private readonly profileService: ProfilesService,
    private readonly authErrorHanding: AuthErrorHanding,
    private readonly profileErrorHanding: ProfileErrorHanding,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async UpdateProfile(
    @Args(
      { name: 'ProfileInput', type: () => ProfileInput },
      new ProfileInputPipe(),
    )
    profileInput: Profile,
    @Context('req') req: Request,
  ) {
    const user_id = await this.authErrorHanding.validateAuthorization(
      req.headers,
    );
    const profile_exist =
      await this.profileErrorHanding.validateProfileExist(user_id);
    if (profile_exist) {
      throw new ForbiddenException('Profile already exist');
    }
    const profile = await this.profileService.updateProfile(
      user_id,
      profileInput,
    );
    if (!profile) throw new ForbiddenException('Profile update failed');
    const message = 'Profile updated successfully';
    return message;
  }

  @UseGuards(AuthGuard)
  @Query(() => Profile)
  async ShowProfile(@Context('req') req: Request) {
    const user_id = await this.authErrorHanding.validateAuthorization(
      req.headers,
    );
    const profile_exist =
      await this.profileErrorHanding.validateProfileExist(user_id);
    if (!profile_exist) {
      throw new ForbiddenException('Profile is not exist');
    }
    return profile_exist;
  }

  // @UseGuards(AuthGuard)
  // @Query(() => Profiles)
  // async findProfile(
  //   @Args({ name: 'profile_name', type: () => String }) name: string,
  //   @Context('req') req: Request,
  // ): Promise<Profiles> {
  //   const user_id = await this.authErrorHanding.validateAuthorization(
  //     req.headers,
  //   );
  //   if (!(await this.profileService.findProfile(user_id)))
  //     throw new Error('Your profile is not created yet');
  //   const profiles_found = await this.profileService.findAllProfileByName(
  //     name,
  //   );
  //   if (!profiles_found) throw new Error('Profile not found');
  //   profiles_found.filter(async (profile) => {
  //     return !(await this.userService.findOneUserById(profile.userId))
  //       .deactive;
  //   });
  //   return { profiles: profiles_found };
  // }
}
