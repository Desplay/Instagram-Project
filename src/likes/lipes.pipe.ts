import { Injectable, PipeTransform } from '@nestjs/common';
import { Like as LikeDTO } from './datatype/like.dto';

@Injectable()
export class LikesEntityToDTO implements PipeTransform {
  transform(value: any): LikeDTO {
    const { userIdLiked, createdAt } = value;
    const newLike: LikeDTO = {
      userIdLiked: userIdLiked.toString(),
      createdAt: createdAt,
    };
    return newLike;
  }
}
