import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioRepositorio } from './dominio/usuario.repositorio';
import { SembradorSuperadministrador } from './aplicacion/sembrador-superadministrador.service';
import { UsuariosService } from './aplicacion/usuarios.service';
import { UsuarioOrmEntity } from './infraestructura/persistencia/usuario.orm-entity';
import { UsuariosRepositorioTypeOrm } from './infraestructura/persistencia/usuarios.repositorio.typeorm';
import { UsuariosController } from './infraestructura/controllers/usuarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioOrmEntity])],
  controllers: [UsuariosController],
  providers: [
    UsuariosService,
    SembradorSuperadministrador,
    { provide: UsuarioRepositorio, useClass: UsuariosRepositorioTypeOrm },
  ],
  exports: [UsuarioRepositorio],
})
export class UsuariosModule {}
