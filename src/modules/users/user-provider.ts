import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserRepository } from './repository/user.repository';
import { getDataSourceToken } from '@nestjs/typeorm';
import { AddressRepository } from '../address/repository/address.repository';
import { Address } from '../address/entities/address.entity';

export const UserRepositoryProvider: Provider = {
  provide: UserRepository,
  useFactory: (dataSource: DataSource) => {
    return new UserRepository(dataSource);
  },
  inject: [getDataSourceToken('default')],
};

export const AddressRepositoryProvider: Provider = {
  provide: AddressRepository,
  useFactory: (dataSource: DataSource) => {
    return new AddressRepository(dataSource);
  },
  inject: [getDataSourceToken('shared')],
};
