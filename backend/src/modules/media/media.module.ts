import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { ImageService } from './image.service';

@Module({
  providers: [CloudinaryService, ImageService],
  exports: [CloudinaryService, ImageService],
})
export class MediaModule {}
