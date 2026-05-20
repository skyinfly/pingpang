import {
  BadRequestException,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DevBearerGuard } from '../common/auth/dev-bearer.guard';
import { UploadsService } from './uploads.service';
import type { UploadKind } from './storage-adapter';

const ALLOWED_KINDS: ReadonlySet<UploadKind> = new Set(['avatar', 'match-cover']);

@Controller('uploads')
@UseGuards(DevBearerGuard)
export class UploadsController {
  constructor(private readonly uploads: UploadsService) {}

  @Post(':kind')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@Param('kind') kind: string, @UploadedFile() file?: Express.Multer.File) {
    if (!ALLOWED_KINDS.has(kind as UploadKind)) {
      throw new BadRequestException(`Unsupported upload kind: ${kind}`);
    }
    if (!file) {
      throw new BadRequestException('file form field is required');
    }

    return this.uploads.upload({
      kind: kind as UploadKind,
      filename: file.originalname,
      buffer: file.buffer,
      mimeType: file.mimetype,
    });
  }
}
