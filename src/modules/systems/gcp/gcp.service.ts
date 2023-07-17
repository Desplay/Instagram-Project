import { Injectable } from '@nestjs/common';
import { File } from '../../../data/entity/file.entity';
import { google } from 'googleapis';

@Injectable()
export class GcpService {
  private drive: any;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'src/config/gcp_drive_api.json',
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    this.drive = google.drive({ version: 'v3', auth });
  }

  async uploadFile(file: File, postID: string): Promise<string> {
    file.filename = postID;
    try {
      const response = await this.drive.files.create({
        requestBody: {
          name: file.filename,
          parents: ['1MQGQtXlx-dNuCImFHx_gRq3x-6ciuBMJ'],
        },
        media: {
          mimeType: file.mimetype,
          body: file.createReadStream(),
        },
      });
      const file_id = response.data.id;
      return `https://drive.google.com/uc?export=view&id=${file_id}`;
    } catch (error) {
      throw new Error(`Upload file failed, Error code: ${error.code}`);
    }
  }

  async deleteFile(postID: string): Promise<boolean> {
    try {
      const response = await this.drive.files.list({
        q: `name = '${postID}'`,
      });
      const file_id = response.data.files[0].id;
      await this.drive.files.delete({
        fileId: file_id,
      });
      return true;
    } catch (error) {
      throw new Error(`Delete file failed, Error code: ${error.code}`);
    }
  }
}
