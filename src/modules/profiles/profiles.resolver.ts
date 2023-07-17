import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProfilesService } from './profiles.service';
import { JwtService } from 'src/modules/systems/jwt/jwt.service';
import { ProfileModel } from '../../data/entity/profile.entity';
import { Profile } from '../../data/dto/profile.dto';
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
    const payload = this.jwtService.verifyToken(access_token);
    const user_id = payload['user_id'];
    if (!user_id) throw new Error('User not found');
    if (await this.profileService.findProfile(user_id)) throw new Error('Profile already exists');
    const newProfile = new ProfileModel({
      name: name,
      birthday: birthday,
      age: age,
      description: description,
      userId: user_id,
    });
    const profile = await this.profileService.createProfile(newProfile);
    if (!profile) throw new Error('Profile creation failed');
    return 'Profile created successfully';
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async UpdateProfile(
    @Args({ name: 'name', type: () => String }) name: string,
    @Args({ name: 'birthday', type: () => Date }) birthday: Date,
    @Args({ name: 'age', type: () => Int }) age: number,
    @Args({ name: 'description', type: () => String }) description: string,
    @Context('req') req: Request,
  ) {
    const access_token = req.headers['access_token'];
    const payload = this.jwtService.verifyToken(access_token);
    const user_id = payload['user_id'];
    if (!user_id) throw new Error('User not found');
    if (!(await this.profileService.findProfile(user_id))) throw new Error('Profile not found');
    const newProfile = {
      name: name,
      birthday: birthday,
      age: age,
      description: description,
    };
    const profile = await this.profileService.updateProfile(user_id, newProfile);
    if (!profile) throw new Error('Profile update failed');
    return 'Profile updated successfully';
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async DeleteProfile(@Context('req') req: Request) {
    const access_token = req.headers['access_token'];
    const payload = this.jwtService.verifyToken(access_token);
    const user_id = payload['user_id'];
    if (!user_id) throw new Error('User not found');
    if (!(await this.profileService.findProfile(user_id))) throw new Error('Profile not found');
    const profile = await this.profileService.deleteProfile(user_id);
    if (!profile) throw new Error('Profile deletion failed');
    return 'Profile deleted successfully';
  }

  @UseGuards(AuthGuard)
  @Query(() => Profile)
  async ShowProfile(@Context('req') req: Request) {
    const access_token = req.headers['access_token'];
    const payload = this.jwtService.verifyToken(access_token);
    const user_id = payload['user_id'];
    if (!user_id) throw new Error('User not found');
    if (!(await this.profileService.findProfile(user_id))) throw new Error('Profile not found');
    return await this.profileService.findProfile(user_id);
  }
}
