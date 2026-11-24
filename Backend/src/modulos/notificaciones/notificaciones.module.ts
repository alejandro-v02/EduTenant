import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificacionRepositorio } from './dominio/notificacion.repositorio';
import { NotificacionesService } from './aplicacion/notificaciones.service';
import { NotificacionOrmEntity } from './infraestructura/persistencia/notificacion.orm-entity';
import { NotificacionesRepositorioTypeOrm } from './infraestructura/persistencia/notificaciones.repositorio.typeorm';
import { NotificacionesController } from './infraestructura/controllers/notificaciones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NotificacionOrmEntity])],
  controllers: [NotificacionesController],
  providers: [
    NotificacionesService,
    { provide: NotificacionRepositorio, useClass: NotificacionesRepositorioTypeOrm },
  ],
  exports: [NotificacionesService],
})
export class NotificacionesModule {}
