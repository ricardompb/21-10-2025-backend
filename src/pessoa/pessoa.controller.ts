import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  // Query,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { Sequelize } from 'sequelize-typescript';

class Pessoa {
  @ApiProperty()
  nome: string;
  @ApiProperty()
  sobrenome: string;
  @ApiProperty()
  idade: number;
}

@ApiBearerAuth()
@Controller('pessoa')
export class PessoaController {
  //   @Get('/')
  //   obterNome() {
  //     return {
  //       nome: 'Ricardo Silva Pereira',
  //       idade: 30,
  //     };
  //   }

  //   @Get('/obter-nome')
  //   obterNomeComQuery(@Query('nome') nome: string) {
  //     return 'Meu nome é ' + nome;
  //   }

  //   @Get('/consultar')
  //   consultar(
  //     @Query('nome') nome: string,
  //     @Query('sobrenome') sobrenome: string,
  //   ) {
  //     const sql =
  //       'select * from pessoa where nome = ' +
  //       nome +
  //       ' and sobrenome = ' +
  //       sobrenome;
  //   }

  constructor(private readonly connection: Sequelize) {}

  @Get(':id')
  obterPorId(@Param('id') id: string) {
    return 'O id informado foi ' + id;
  }

  @Get('/')
  async listarTodos() {
    const [results] = await this.connection.query('select * from pessoa', {
      raw: true,
    });
    return results;
  }

  @Post('/')
  criarPessoa(@Body() data: Pessoa) {
    return data;
  }

  @Put(':id')
  atualizarPessoa(@Param('id') id: string, data: Pessoa) {}

  @Delete(':id')
  excluirPessoa(@Param('id') id: string) {}
}
