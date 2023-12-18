import { Injectable, PipeTransform } from '@nestjs/common';
import { Like as LikeDTO } from './datatype/like.dto';

@Injectable()
export class LikesEntityToDTO implements PipeTransform {
  transform(value: any): LikeDTO {
    const { createdAt } = value;
    const newLike: LikeDTO = {
      profileIdLiked: '',
      createdAt: createdAt,
    };
    return newLike;
  }
}
