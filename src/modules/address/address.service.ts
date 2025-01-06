import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressRepository } from './repository/address.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from 'src/database/entities/address.entity';
import { BaseCustomRepository } from 'src/database/repository/base-custom.repository';

@Injectable()
export class AddressService {
  constructor(private addressRepository: AddressRepository) {}
  create(createAddressDto: CreateAddressDto) {
    return 'This action adds a new address';
  }

  async findAll() {
    return await this.addressRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
