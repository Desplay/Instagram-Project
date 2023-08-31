import {
  ForbiddenException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { PostInput } from './datatype/post.dto';
import { Post } from './datatype/post.entity';

@Injectable()
export class PostInputPipe implements PipeTransform {
  transform(value: PostInput): PostInput {
    const { title, content } = value;
    if (!title) {
      throw new ForbiddenException('Title is required');
    }
    if (!content) {
      throw new ForbiddenException('Content is required');
    }
    return value;
  }
}

@Injectable()
export class PostTransformPipe implements PipeTransform {
  transform(value: PostInput): Post {
    const newValue = {
      title: value.title,
      content: value.content,
      imageUrl: '',
      userId: '',
    };
    return newValue;
  }
}

export class PostPipe {
  static PostInputPipe = PostInputPipe;
  static PostTransformPipe = PostTransformPipe;
}
