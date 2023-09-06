import { Injectable } from '@nestjs/common';
import { File } from './datatype/file.entity';
import { v2 } from 'cloudinary';
import { Readable } from 'stream';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    const buffer: Uint8Array[] = [];
    return new Promise((resolve, reject) =>
      stream
        .on('error', (error) => reject(error))
        .on('data', (data) => buffer.push(data))
        .on('end', () => resolve(Buffer.concat(buffer))),
    );
  }
  async uploadFile(file: File, postID: string): Promise<string> {
    file.filename = `${postID}.${file.filename.split('.').pop()}`;
    const buffer = await this.streamToBuffer(file.createReadStream());
    const result = await new Promise((resolve) => {
      const upload = v2.uploader.upload_stream(
        { folder: 'nestjs_graphql_mongodb_basic', public_id: postID },
        (error, result) => {
          if (error) return undefined;
          resolve(result);
        },
      );
      toStream(buffer).pipe(upload);
    });
    const fileUrl = result['secure_url'];
    return fileUrl;
  }

  async deleteFile(postID: string): Promise<boolean> {
    const file_exists = await v2.api.resource(
      `nestjs_graphql_mongodb_basic/${postID}`,
    );
    if (!file_exists) return false;
    const response = await v2.api.delete_resources([
      `nestjs_graphql_mongodb_basic/${postID}`,
    ]);
    if (!response) return false;
    return true;
  }
}
