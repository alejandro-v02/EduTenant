import { Module } from '@nestjs/common';
import { CursosModule } from '../cursos/cursos.module';
import { InstitucionesModule } from '../instituciones/instituciones.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { SuperadministradorService } from './aplicacion/superadministrador.service';
import { SuperadministradorController } from './infraestructura/controllers/superadministrador.controller';

@Module({
  imports: [InstitucionesModule, UsuariosModule, CursosModule],
  controllers: [SuperadministradorController],
  providers: [SuperadministradorService],
})
export class SuperadministradorModule {}
