import { Injectable } from '@nestjs/common';
import { File } from './datatype/file.entity';
import { v2 } from 'cloudinary';
import { Readable } from 'stream';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    const buffer: Uint8Array[] = [];
    console.log(stream);
    return new Promise((resolve, reject) =>
      stream
        .on('error', (error) => reject(error))
        .on('data', (data) => buffer.push(data))
        .on('end', () => resolve(Buffer.concat(buffer))),
    );
  }
  async uploadFile(file: File, postID: string): Promise<string> {
    file.filename = `${postID}.${file.mimetype.split('.').pop()}`;
    const buffer = await this.streamToBuffer(file.createReadStream());
    const result = await new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { folder: 'nestjs_graphql_mongodb_basic' },
        (error, result) => {
          if (error) throw reject(error);
          resolve(result);
        },
      );
      toStream(buffer).pipe(upload);
    });
    const fileUrl = result['secure_url'];
    return fileUrl;
  }

  async deleteFile(postID: string): Promise<boolean> {
    try {
      const response = await v2.api.resources({
        type: 'upload',
        prefix: 'nestjs_graphql_mongodb_basic',
      });
      const file = response.resources.find(
        (file: any) => file.public_id === postID,
      );
      if (!file) return false;
      await v2.uploader.destroy(file.public_id);
      return true;
    } catch (error) {
      throw new Error(`Delete file failed, Error code: ${error.code}`);
    }
  }
}
