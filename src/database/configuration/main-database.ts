import { DataSource } from 'typeorm';
import { join } from 'path';

export const MainDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'tenant_1',
  entities: [join(__dirname, 'database', 'entities', '*.{ts,js}')],
  migrations: [join(__dirname, 'database', 'migration', 'main', '*.{ts,js}')],
  synchronize: false,
  logging: true,
});
