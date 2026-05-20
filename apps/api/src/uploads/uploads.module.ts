import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UsersModule } from '../users/users.module';
import { LocalDiskStorage } from './local-disk-storage';
import { UploadsController } from './uploads.controller';
import { UploadsService, STORAGE_ADAPTER } from './uploads.service';

@Module({
  imports: [
    UsersModule,
    MulterModule.register({
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // safety net; UploadsService enforces per-kind caps
      },
    }),
  ],
  controllers: [UploadsController],
  providers: [
    LocalDiskStorage,
    {
      provide: STORAGE_ADAPTER,
      useExisting: LocalDiskStorage,
    },
    UploadsService,
  ],
  exports: [UploadsService],
})
export class UploadsModule {}
