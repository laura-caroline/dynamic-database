import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { UserEntity } from 'src/database/entities/users';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(
      UserEntity,
      dataSource
        .setOptions({
          name: 'shared',
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'white',
          entities: [
            join(
              __dirname,
              '..',
              '..',
              '..',
              'database',
              'entities',
              '*.{ts,js}',
            ),
          ],
          migrations: [
            join(
              __dirname,
              '..',
              '..',
              '..',
              'database',
              'migration',
              '*.{ts,js}',
            ),
          ],
          synchronize: false,
        })
        .createEntityManager(),
    );
  }

  // Atualize o método defaultSelect
  defaultSelect(): Record<string, boolean> {
    return {
      id: true,
      name: true,
      active: true,
    }; // Seleção compatível com FindOptionsSelect
  }

  // Atualize o uso em findTeste
  async findTeste() {
    const users = await this.find();

    console.log('findTeste completed, returning users:', users);
    return users;
  }
}
