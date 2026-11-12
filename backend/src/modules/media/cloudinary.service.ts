import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'crypto';

@Injectable()
export class CloudinaryService {
  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: config.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  uploadBuffer(buffer: Buffer, folder: string): Promise<UploadApiResponse> {
    this.assertConfigured();
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: randomUUID(),
          resource_type: 'image',
          overwrite: false,
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error('Cloudinary no devolvió resultado.'));
          resolve(result);
        },
      );
      stream.end(buffer);
    });
  }

  async destroy(publicId?: string): Promise<void> {
    if (!publicId) return;
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true });
    } catch {
      // Limpieza best-effort: no ocultar el error principal de la operación.
    }
  }

  private assertConfigured(): void {
    const keys = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
    const missing = keys.filter((key) => !this.config.get<string>(key));
    if (missing.length) {
      throw new InternalServerErrorException(`Cloudinary no está configurado. Faltan: ${missing.join(', ')}`);
    }
  }
}
