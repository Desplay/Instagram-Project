import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProfilesService } from './profiles.service';
import { JwtService } from '@nestjs/jwt';
import { ProfileModel } from './profiles.entity';
import { Profile } from './profiles.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class ProfilesResolver {
  constructor(private readonly profileService: ProfilesService, private readonly jwtService: JwtService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async CreateProfile(
    @Args({ name: 'name', type: () => String }) name: string,
    @Args({ name: 'birthday', type: () => Date }) birthday: Date,
    @Args({ name: 'age', type: () => Int }) age: number,
    @Args({ name: 'description', type: () => String }) description: string,
    @Context('req') req: Request,
  ) {
    const access_token = req.headers['access_token'];
    const payload = this.jwtService.decode(access_token);
    const id_user = payload['id_user'];
    if (!id_user) throw new Error('User not found');
    if (await this.profileService.findProfile(id_user)) throw new Error('Profile already exists');
    const newProfile = new ProfileModel({
      name: name,
      birthday: birthday,
      age: age,
      description: description,
      userId: id_user,
    });
    const profile = await this.profileService.createProfile(newProfile);
    if (!profile) throw new Error('Profile creation failed');
    return 'Profile created successfully';
  }

  @UseGuards(AuthGuard)
  @Query(() => Profile)
  async GetDetailProfile(@Context('req') req: Request) {
    const access_token = req.headers['access_token'];
    const payload = this.jwtService.decode(access_token);
    const id_user = payload['id_user'];
    if (!id_user) throw new Error('User not found');
    if (!(await this.profileService.findProfile(id_user))) throw new Error('Profile not found');
    return await this.profileService.findProfile(id_user);
  }
}
