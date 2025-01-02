import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { AddressRepository } from './repository/address.repository';
import { AddressEntity } from 'src/database/entities/address.entity';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity], 'shared')],
  controllers: [AddressController],
  providers: [AddressService, AddressRepository],
})
export class AddressModule {}
