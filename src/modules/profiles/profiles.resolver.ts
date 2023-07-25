import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProfilesService } from './profiles.service';
import { JwtService } from 'src/modules/systems/jwt/jwt.service';
import { ProfileModel } from '../../common/entity/profile.entity';
import { Profile, Profiles } from '../../common/dto/profile.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Resolver()
export class ProfilesResolver {
  constructor(
    private readonly profileService: ProfilesService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async CreateProfile(
    @Args({ name: 'name', type: () => String }) name: string,
    @Args({ name: 'birthday', type: () => Date }) birthday: Date,
    @Args({ name: 'age', type: () => Int }) age: number,
    @Args({ name: 'description', type: () => String }) description: string,
    @Context('req') req: Request,
  ) {
    const payload = await this.jwtService.extractToken(req.headers['access_token']);
    const user_id = payload['user_id'];
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
    const payload = await this.jwtService.extractToken(req.headers['access_token']);
    const user_id = payload['user_id'];
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
    const payload = await this.jwtService.extractToken(req.headers['access_token']);
    const user_id = payload['user_id'];
    if (!(await this.profileService.findProfile(user_id))) throw new Error('Profile not found');
    const profile = await this.profileService.deleteProfile(user_id);
    if (!profile) throw new Error('Profile deletion failed');
    return 'Profile deleted successfully';
  }

  @UseGuards(AuthGuard)
  @Query(() => Profile)
  async ShowProfile(@Context('req') req: Request) {
    const payload = await this.jwtService.extractToken(req.headers['access_token']);
    const user_id = payload['user_id'];
    if (!(await this.profileService.findProfile(user_id))) throw new Error('Profile not found');
    return await this.profileService.findProfile(user_id);
  }

  @UseGuards(AuthGuard)
  @Query(() => Profiles)
  async findProfile(@Args({ name: 'profile_name', type: () => String }) name: string, @Context('req') req: Request): Promise<Profiles> {
    const payload = await this.jwtService.extractToken(req.headers['access_token']);
    const user_id = payload['user_id'];
    if (!(await this.profileService.findProfile(user_id))) throw new Error('Your profile is not created yet');
    const profiles_found = await this.profileService.findAllProfileByName(name);
    if (!profiles_found) throw new Error('Profile not found');
    profiles_found.filter(async (profile) => {
      return !(await this.userService.findOneUserById(profile.userId)).deactive;
    });
    return { profiles: profiles_found };
  }
}
