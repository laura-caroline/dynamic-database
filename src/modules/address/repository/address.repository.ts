import { Injectable } from '@nestjs/common';
import { AddressEntity } from 'src/database/entities/address.entity';
import { BaseCustomRepository } from 'src/database/repository/base-custom.repository';
import { Repository } from 'typeorm';

@Injectable()
export class AddressRepository extends BaseCustomRepository<AddressEntity> {
  defaultSelect(): string[] {
    throw new Error('Method not implemented.');
  }
  teste() {
    return 'x';
  }
}
