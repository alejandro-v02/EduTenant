import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorreoModule } from '../correo/correo.module';
import { CursosModule } from '../cursos/cursos.module';
import { MatriculasModule } from '../matriculas/matriculas.module';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { MaterialRepositorio } from './dominio/material.repositorio';
import { MaterialesService } from './aplicacion/materiales.service';
import { MaterialOrmEntity } from './infraestructura/persistencia/material.orm-entity';
import { MaterialesRepositorioTypeOrm } from './infraestructura/persistencia/materiales.repositorio.typeorm';
import { MaterialesController } from './infraestructura/controllers/materiales.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([MaterialOrmEntity]),
    CursosModule,
    MatriculasModule,
    UsuariosModule,
    CorreoModule,
    NotificacionesModule,
  ],
  controllers: [MaterialesController],
  providers: [
    MaterialesService,
    { provide: MaterialRepositorio, useClass: MaterialesRepositorioTypeOrm },
  ],
  exports: [MaterialRepositorio],
})
export class MaterialesModule {}
