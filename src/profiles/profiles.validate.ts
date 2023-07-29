import { ForbiddenException, Injectable } from '@nestjs/common';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class ProfileErrorHanding {
  constructor(private readonly profilesService: ProfilesService) {}
  async validateProfileExist(user_id: string): Promise<boolean> {
    if (!user_id) {
      throw new ForbiddenException('User id is empty');
    }
    if (!(await this.profilesService.findProfile(user_id))) {
      throw new ForbiddenException('Profile is not exist');
    }
    return true;
  }
}
