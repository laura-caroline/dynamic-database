import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TenantSaveIdentifierDatabaseModule } from './middleware/provider/tenant-save-identifier-database.module';
import { TenantMiddleware } from './middleware/tenant-middleware';
import { AddressModule } from './modules/address/address.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    TenantSaveIdentifierDatabaseModule,
    // SharedModulesDatabase,
    TypeOrmModule.forRoot({
      name: 'shared',
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'white',
      entities: [join(__dirname, 'database', 'entities', '*.{ts,js}')],
      migrations: [join(__dirname, 'database', 'migration', '*.{ts,js}')],
      synchronize: false,
    }),
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'white',
      entities: [join(__dirname, 'database', 'entities', '*.{ts,js}')],
      migrations: [join(__dirname, 'database', 'migration', '*.{ts,js}')],
      synchronize: false,
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
