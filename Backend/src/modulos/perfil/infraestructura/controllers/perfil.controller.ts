import { Body, Controller, Get, HttpCode, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { UsuarioActual } from '../../../../compartido/decoradores/usuario-actual.decorator';
import { JwtAuthGuard } from '../../../../compartido/guards/jwt-auth.guard';
import { UsuarioAutenticado } from '../../../../compartido/tipos/usuario-autenticado.interface';
import { PerfilService } from '../../aplicacion/perfil.service';
import { ActualizarPerfilDto } from '../dto/actualizar-perfil.dto';
import { CambiarClaveDto } from '../dto/cambiar-clave.dto';

/**
 * Perfil del propio usuario autenticado, sin importar su rol o institución:
 * por eso sólo exige JwtAuthGuard (ni RolesGuard ni InstitucionGuard, que
 * excluirían al superadministrador al no tener institucionId).
 */
@Controller('perfil')
@UseGuards(JwtAuthGuard)
export class PerfilController {
  constructor(private readonly perfilService: PerfilService) {}

  @Get()
  obtener(@UsuarioActual() usuario: UsuarioAutenticado) {
    return this.perfilService.obtener(usuario.id);
  }

  @Patch()
  actualizar(@UsuarioActual() usuario: UsuarioAutenticado, @Body() dto: ActualizarPerfilDto) {
    return this.perfilService.actualizar(usuario.id, dto);
  }

  @Patch('clave')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cambiarClave(@UsuarioActual() usuario: UsuarioAutenticado, @Body() dto: CambiarClaveDto): Promise<void> {
    await this.perfilService.cambiarClave(usuario.id, dto.claveActual, dto.claveNueva);
  }
}
