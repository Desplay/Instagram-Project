import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { UploadfileService } from './uploadfile.service';

@Resolver()
export class UploadfileResolver {
  constructor(private readonly uploadfileService: UploadfileService) {}

  @Mutation(() => String)
  async singleUpload(
    @Args({ name: 'file', type: () => GraphQLUpload })
    file: FileUpload,
  ) {
    await this.uploadfileService.saveFilefromUpload(file);
    return 'upload success';
  }
}
