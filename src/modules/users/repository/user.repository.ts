import { Injectable } from '@nestjs/common';
import { AddressEntity } from 'src/database/entities/address.entity';
import { UserEntity } from 'src/database/entities/users';
import { BaseCustomRepository } from 'src/database/repository/base-custom.repository';
import { DataSource, Repository } from 'typeorm';

export class UserRepository extends Repository<UserEntity> {
  defaultSelect(): string[] {
    throw new Error('Method not implemented.');
  }
  async findteste() {
    return await this.find();
  }
}
