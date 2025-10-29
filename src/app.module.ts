import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PessoaController } from './pessoa/pessoa.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuarioController } from './usuario/usuario.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: 360000 },
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        dialect: config.get('DB_DIALECT'),
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
      }),
      inject: [ConfigService],
    }),
  ], // adiciona modulos de terceiros
  controllers: [PessoaController, UsuarioController], // adiciona as apis (Controllers)
  providers: [AuthGuard], // adiciona os servicos (Services)
})
export class AppModule {}
