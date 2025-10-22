import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PessoaController } from './pessoa/pessoa.controller';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'sa',
      password: '@R123456*',
      database: 'estoque',
      models: [],
    }),
  ], // adiciona modulos de terceiros
  controllers: [PessoaController], // adiciona as apis (Controllers)
  providers: [], // adiciona os servicos (Services)
})
export class AppModule {}
