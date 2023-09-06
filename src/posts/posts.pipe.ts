import {
  ForbiddenException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { PostInput, PostDTO } from './datatype/post.dto';
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
export class PostDTOToEntity implements PipeTransform {
  transform(value: PostInput): Post {
    const newValue = {
      title: value.title,
      content: value.content,
      imageUrl: null,
      userId: '',
    };
    return newValue;
  }
}

@Injectable()
export class PostEntityToDTO implements PipeTransform {
  transform(value: any): PostDTO {
    const newValue = {
      id: value._id,
      title: value.title,
      content: value.content,
      imageUrl: value.imageUrl,
    };
    return newValue;
  }
}

export class PostPipe {
  static PostInputPipe = PostInputPipe;
  static PostDTOToEntity = PostDTOToEntity;
}
