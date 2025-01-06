import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AddressEntity } from 'src/database/entities/address.entity';
import { DataSource } from 'typeorm'; // Certifique-se de importar corretamente

@Injectable()
export class AddressRepository extends Repository<AddressEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AddressEntity, dataSource.createEntityManager());
  }

  // Métodos customizados podem ser adicionados aqui
}
