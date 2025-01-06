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
import { AddressModule } from '../address/address.module';

@Module({
  imports: [AddressModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
})
export class UsersModule {}
