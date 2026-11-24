import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { CursoRepositorio } from './dominio/curso.repositorio';
import { CursosService } from './aplicacion/cursos.service';
import { CursoOrmEntity } from './infraestructura/persistencia/curso.orm-entity';
import { CursosRepositorioTypeOrm } from './infraestructura/persistencia/cursos.repositorio.typeorm';
import { CursosController } from './infraestructura/controllers/cursos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CursoOrmEntity]), UsuariosModule],
  controllers: [CursosController],
  providers: [CursosService, { provide: CursoRepositorio, useClass: CursosRepositorioTypeOrm }],
  exports: [CursoRepositorio],
})
export class CursosModule {}
