import { Module } from '@nestjs/common';
import { TenantSaveIdentifierDatabaseService } from './tenant-save-identifier-database.service';

@Module({
  providers: [TenantSaveIdentifierDatabaseService],
  exports: [TenantSaveIdentifierDatabaseService],
})
export class TenantSaveIdentifierDatabaseModule {}
