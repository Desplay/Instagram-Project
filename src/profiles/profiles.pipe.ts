import {
  ForbiddenException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ProfileInput } from './datatype/profile.dto';

@Injectable()
export class ProfileInputPipe implements PipeTransform {
  transform(value: ProfileInput): ProfileInput {
    const { name, birthday, age, description } = value;
    if (!name) {
      throw new ForbiddenException('Name is required');
    }
    if (!birthday) {
      throw new ForbiddenException('Birthday is required');
    }
    if (!age) {
      throw new ForbiddenException('Age is required');
    }
    if (!description) {
      throw new ForbiddenException('Description is required');
    }
    return value;
  }
}

export class ProfilePipe {
  static ProfileInputPipe = ProfileInputPipe;
}
