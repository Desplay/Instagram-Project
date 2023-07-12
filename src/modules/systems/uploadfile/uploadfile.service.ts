import { Injectable } from '@nestjs/common';
import { File } from './uploadfile.entity';
import { createWriteStream } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadfileService {
  async saveFilefromUpload(file: File): Promise<string> {
    new Promise(async () => {
      file.createReadStream().pipe(createWriteStream(join(process.cwd(), `./src/upload/${file.filename}`)));
    });
    return 'upload success';
  }
}
