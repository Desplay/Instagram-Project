import { v2 } from 'cloudinary';
import { Cloudinary } from 'src/config/cloudinary.config';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: () => {
    return v2.config({
      cloud_name: Cloudinary.cloud_name,
      api_key: Cloudinary.api_key,
      api_secret: Cloudinary.api_serect,
      secure: true,
    });
  },
};
