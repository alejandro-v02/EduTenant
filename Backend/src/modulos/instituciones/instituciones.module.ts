import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitucionRepositorio } from './dominio/institucion.repositorio';
import { InstitucionesService } from './aplicacion/instituciones.service';
import { InstitucionOrmEntity } from './infraestructura/persistencia/institucion.orm-entity';
import { InstitucionesRepositorioTypeOrm } from './infraestructura/persistencia/instituciones.repositorio.typeorm';
import { InstitucionesController } from './infraestructura/controllers/instituciones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InstitucionOrmEntity])],
  controllers: [InstitucionesController],
  providers: [
    InstitucionesService,
    { provide: InstitucionRepositorio, useClass: InstitucionesRepositorioTypeOrm },
  ],
  exports: [InstitucionRepositorio],
})
export class InstitucionesModule {}
