import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorreoModule } from '../correo/correo.module';
import { CursosModule } from '../cursos/cursos.module';
import { MatriculasModule } from '../matriculas/matriculas.module';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { AsistenciaRepositorio } from './dominio/asistencia.repositorio';
import { AsistenciaService } from './aplicacion/asistencia.service';
import { AsistenciaOrmEntity } from './infraestructura/persistencia/asistencia.orm-entity';
import { AsistenciaRepositorioTypeOrm } from './infraestructura/persistencia/asistencia.repositorio.typeorm';
import { AsistenciaController } from './infraestructura/controllers/asistencia.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AsistenciaOrmEntity]),
    CursosModule,
    MatriculasModule,
    UsuariosModule,
    CorreoModule,
    NotificacionesModule,
  ],
  controllers: [AsistenciaController],
  providers: [
    AsistenciaService,
    { provide: AsistenciaRepositorio, useClass: AsistenciaRepositorioTypeOrm },
  ],
  exports: [AsistenciaRepositorio],
})
export class AsistenciaModule {}
