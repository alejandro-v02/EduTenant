import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorreoModule } from '../correo/correo.module';
import { CursosModule } from '../cursos/cursos.module';
import { MatriculasModule } from '../matriculas/matriculas.module';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { NotaRepositorio } from './dominio/nota.repositorio';
import { NotasService } from './aplicacion/notas.service';
import { NotaOrmEntity } from './infraestructura/persistencia/nota.orm-entity';
import { NotasRepositorioTypeOrm } from './infraestructura/persistencia/notas.repositorio.typeorm';
import { NotasController } from './infraestructura/controllers/notas.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotaOrmEntity]),
    CursosModule,
    MatriculasModule,
    UsuariosModule,
    CorreoModule,
    NotificacionesModule,
  ],
  controllers: [NotasController],
  providers: [NotasService, { provide: NotaRepositorio, useClass: NotasRepositorioTypeOrm }],
  exports: [NotaRepositorio],
})
export class NotasModule {}
