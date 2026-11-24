import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursosModule } from '../cursos/cursos.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { MatriculaRepositorio } from './dominio/matricula.repositorio';
import { MatriculasService } from './aplicacion/matriculas.service';
import { MatriculaOrmEntity } from './infraestructura/persistencia/matricula.orm-entity';
import { MatriculasRepositorioTypeOrm } from './infraestructura/persistencia/matriculas.repositorio.typeorm';
import { MatriculasController } from './infraestructura/controllers/matriculas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MatriculaOrmEntity]), CursosModule, UsuariosModule],
  controllers: [MatriculasController],
  providers: [
    MatriculasService,
    { provide: MatriculaRepositorio, useClass: MatriculasRepositorioTypeOrm },
  ],
  exports: [MatriculaRepositorio],
})
export class MatriculasModule {}
