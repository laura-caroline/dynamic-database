import { Module } from '@nestjs/common';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([], 'shared'), // Conexão "shared"
  ],
  providers: [
    {
      provide: 'SHARED_DATASOURCE', // Nome personalizado para o DataSource
      useFactory: async (dataSourceToken: DataSource) => dataSourceToken,
      inject: [getDataSourceToken('shared')], // Obtém o DataSource da conexão "shared"
    },
  ],
  exports: ['SHARED_DATASOURCE'], // Exporta o DataSource para outros módulos
})
export class SharedModule {}
