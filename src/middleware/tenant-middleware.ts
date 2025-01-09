import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async use(req: any, _res: any, next: () => void) {
    const tenantId = req.headers['x-tenant-id'];
    await this.dataSource.destroy();

    if (!tenantId) {
      throw new BadRequestException('X-Tenant-ID validation failed.');
    }

    this.dataSource.setOptions({
      name: 'default',
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: `tenant_${tenantId}`,
      synchronize: false,
      logging: false,
    });

    await this.dataSource.initialize();
    next();
  }
}
