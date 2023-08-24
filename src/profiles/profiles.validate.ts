import { ForbiddenException, Injectable } from '@nestjs/common';
import { ProfilesService } from '../profiles/profiles.service';
import { Profile } from './datatype/profile.dto';

@Injectable()
export class ProfileErrorHanding {
  constructor(private readonly profilesService: ProfilesService) {}
  async validateProfileExist(user_id: string): Promise<Profile> {
    if (!user_id) {
      throw new ForbiddenException('User id is empty');
    }
    const profile_exist = await this.profilesService.findProfile(user_id);
    if (!profile_exist) {
      throw new ForbiddenException('Profile is not exist');
    }
    return profile_exist;
  }
}
