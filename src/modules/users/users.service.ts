import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource, DataSourceOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/users';
import { AddressEntity } from 'src/database/entities/address.entity';
import { UserRepository } from './repository/user.repository';
import { AddressRepository } from '../address/repository/address.repository';
import { join } from 'path';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private addressRepository: AddressRepository,
  ) {}

  async create() {
    const tenantDbName = `tenant_${9}`;

    // Conecte-se ao banco de dados principal para criar o banco do tenant
    const mainDataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'postgres', // Use um banco padrão para operações administrativas
    });

    await mainDataSource.initialize();
    const queryRunner = mainDataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      // Crie o banco de dados do tenant
      const query = `CREATE DATABASE "${tenantDbName}"`;
      await queryRunner.query(query);
      console.log(`Banco de dados ${tenantDbName} criado com sucesso.`);
    } catch (error) {
      if (error.code !== '42P04') {
        console.error(`Erro ao criar o banco de dados ${tenantDbName}:`, error);
        throw error;
      }
      console.log(`Banco de dados ${tenantDbName} já existe.`);
    } finally {
      await queryRunner.release();
      await mainDataSource.destroy();
    }

    // Conecte-se ao banco do tenant e execute as migrações
    const tenantDbOptions: DataSourceOptions = {
      type: 'postgres', // Certifique-se de que o tipo de banco de dados seja 'postgres'
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: tenantDbName,
      entities: [
        join(__dirname, '..', '..', 'database', 'entities', '*.{ts,js}'),
      ],
      migrations: [
        join(__dirname, '..', '..', 'database', 'migrations', '*.{ts,js}'),
      ],
    };

    const tenantDataSource = new DataSource(tenantDbOptions);
    await tenantDataSource.initialize();
    try {
      console.log(`Executando migrações para ${tenantDbName}...`);
      await tenantDataSource.runMigrations();
      console.log(`Migrações concluídas para ${tenantDbName}.`);
    } catch (error) {
      console.error(`Erro ao executar migrações para ${tenantDbName}:`, error);
      throw error;
    } finally {
      await tenantDataSource.destroy();
    }
  }

  async findAll() {
    return await this.userRepository.findTeste();
  }

  async findAddress() {
    return await this.addressRepository.teste();
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
