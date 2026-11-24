import { Module } from '@nestjs/common';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { PerfilService } from './aplicacion/perfil.service';
import { PerfilController } from './infraestructura/controllers/perfil.controller';

@Module({
  imports: [UsuariosModule],
  controllers: [PerfilController],
  providers: [PerfilService],
})
export class PerfilModule {}
