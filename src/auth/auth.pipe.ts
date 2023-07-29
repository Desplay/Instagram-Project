import {
  ForbiddenException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { UserSignIn } from 'src/users/datatype/user.dto';
import { UserSignUp } from 'src/users/datatype/user.dto';

@Injectable()
export class UserSignUpPipe implements PipeTransform {
  transform(value: UserSignUp): UserSignUp {
    if (!value.email) {
      throw new ForbiddenException('Email is required');
    }
    if (!value.email.includes('@')) {
      throw new ForbiddenException('Email is invalid');
    }
    if (!value.username) {
      throw new ForbiddenException('Username is required');
    }
    if (!value.password) {
      throw new ForbiddenException('Password is required');
    }
    if (value.password.length < 8) {
      throw new ForbiddenException(
        'Password must be at least 8 characters',
      );
    }
    return value;
  }
}

@Injectable()
export class UserSignInPipe implements PipeTransform {
  transform(value: UserSignIn): UserSignIn {
    return value;
  }
}

export class AuthPipe {
  static UserSignUpPipe = UserSignUpPipe;
  static UserSignInPipe = UserSignInPipe;
}
