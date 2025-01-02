import { Injectable, NestMiddleware } from '@nestjs/common';
import { TenantSaveIdentifierDatabaseService } from './provider/tenant-save-identifier-database.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private readonly tenantSaveIdentifierDatabaseService: TenantSaveIdentifierDatabaseService,
  ) {}

  use(req: any, res: any, next: () => void) {
    const tenantId = req.headers['x-tenant-id'] || 1;
    this.tenantSaveIdentifierDatabaseService.setTenantId(tenantId);

    next();
  }
}
