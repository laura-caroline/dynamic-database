import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from './modules/address/address.module';
import { Address } from './modules/address/entities/address.entity';
import { BaseCustomRepository } from './database/repository/base-custom.repository';
import { UsersModule } from './modules/users/users.module';
import { TenantMiddleware } from './middleware/tenant-middleware';
import { TenantSaveIdentifierDatabaseModule } from './middleware/provider/tenant-save-identifier-database.module';
import { TenantSaveIdentifierDatabaseService } from './middleware/provider/tenant-save-identifier-database.service';

@Module({
  imports: [
    TenantSaveIdentifierDatabaseModule,
    TypeOrmModule.forRoot({
      name: 'shared',
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'tenant_2',
      entities: [join(__dirname, 'database', 'entities', '*.{ts,js}')],
      migrations: [join(__dirname, 'database', 'migration', '*.{ts,js}')],
      synchronize: false,
    }),
    TypeOrmModule.forRootAsync({
      name: 'default',
      imports: [TenantSaveIdentifierDatabaseModule],
      inject: [TenantSaveIdentifierDatabaseService],
      useFactory: async (
        tenantProvider: TenantSaveIdentifierDatabaseService,
      ) => {
        console.log('veio aqui');
        const tenantId = tenantProvider.getTenantId();
        const databaseName = `tenant_${tenantId}`;
        return {
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: databaseName,
          entities: [join(__dirname, 'database', 'entities', '*.{ts,js}')],
          migrations: [join(__dirname, 'database', 'migration', '*.{ts,js}')],
          synchronize: false,
        };
      },
    }),
    AddressModule,
    UsersModule,
  ],
  providers: [],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
