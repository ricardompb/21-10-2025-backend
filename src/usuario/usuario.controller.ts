import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { Sequelize } from 'sequelize-typescript';
import { JwtService } from '@nestjs/jwt';
import { Public } from 'src';

class CriarUsuarioBody {
  @ApiProperty({
    description:
      'E-mail que o usuário vai usar para se autenticar na plataforma.',
  })
  @IsEmail({}, { message: 'O email informado é inválido' })
  email: string;

  @ApiProperty({
    description:
      'A senha que o usuário vai usar para se autenticar na plataforma.',
  })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  senha: string;
}

@ApiBearerAuth()
@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly connection: Sequelize,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post()
  async create(@Body() body: CriarUsuarioBody) {
    body.senha = await bcrypt.hash(body.senha, 10);
    await this.connection.query(
      'INSERT INTO usuario (email, senha) VALUES (?, ?)',
      {
        replacements: [body.email, body.senha],
      },
    );
  }

  @Get()
  async listarTodos() {
    const [results] = await this.connection.query(
      'select id, email from usuario',
      {
        raw: true,
      },
    );
    return results;
  }

  @Public()
  @Post('/login')
  async login(@Body() body: CriarUsuarioBody) {
    const [users] = await this.connection.query(
      'select * from usuario where email = ?',
      {
        replacements: [body.email],
        raw: true,
      },
    );

    if (!users) {
      throw new Error('Usuário não encontrado');
    }

    const user = users[0] as { id: number; email: string; senha: string };

    const isPasswordValid = await bcrypt.compare(body.senha, user.senha);
    if (!isPasswordValid) {
      throw new Error('Senha inválida');
    }

    const token = this.jwtService.sign({ id: user.id, email: user.email });
    return { token };
  }
}
