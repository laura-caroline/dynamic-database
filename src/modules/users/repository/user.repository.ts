import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/database/entities/users';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
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
