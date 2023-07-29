import {
  ForbiddenException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ProfileInput } from './datatype/profile.dto';

@Injectable()
export class ProfileInputPipe implements PipeTransform {
  transform(value: ProfileInput): ProfileInput {
    if (!value.name) {
      throw new ForbiddenException('Name is required');
    }
    if (!value.birthday) {
      throw new ForbiddenException('Birthday is required');
    }
    if (!value.age) {
      throw new ForbiddenException('Age is required');
    }
    if (!value.description) {
      throw new ForbiddenException('Description is required');
    }
    return value;
  }
}

export class ProfilePipe {
  static ProfileInputPipe = ProfileInputPipe;
}
