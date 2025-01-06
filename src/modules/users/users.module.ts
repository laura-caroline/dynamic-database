import { Module, Provider } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/users';
import { AddressEntity } from 'src/database/entities/address.entity';
import { UserRepository } from './repository/user.repository';
import { DataSource } from 'typeorm';
import {
  AddressRepositoryProvider,
  UserRepositoryProvider,
} from './user-provider';
import { AddressRepository } from '../address/repository/address.repository';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, AddressRepositoryProvider],
})
export class UsersModule {}
