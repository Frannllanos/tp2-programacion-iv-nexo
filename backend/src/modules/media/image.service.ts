import { BadRequestException, Injectable } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class ImageService {
  async normalizarPerfil(buffer: Buffer): Promise<Buffer> {
    return this.procesar(buffer, true);
  }

  async normalizarPublicacion(buffer: Buffer): Promise<Buffer> {
    return this.procesar(buffer, false);
  }

  private async procesar(buffer: Buffer, perfil: boolean): Promise<Buffer> {
    try {
      const image = sharp(buffer, { failOn: 'error', limitInputPixels: 25_000_000 });
      const metadata = await image.metadata();
      if (!metadata.width || !metadata.height) {
        throw new Error('No fue posible leer la geometría.');
      }

      const pipeline = image.rotate();
      if (perfil) {
        return await pipeline
          .resize(512, 512, { fit: 'cover', position: 'centre' })
          .jpeg({ quality: 86, mozjpeg: true })
          .toBuffer();
      }

      return await pipeline
        .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 86, mozjpeg: true })
        .toBuffer();
    } catch {
      throw new BadRequestException('El archivo recibido no pudo validarse como una imagen segura.');
    }
  }
}
