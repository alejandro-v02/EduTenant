import { Controller, Get, HttpCode, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common';
import { UsuarioActual } from '../../../../compartido/decoradores/usuario-actual.decorator';
import { JwtAuthGuard } from '../../../../compartido/guards/jwt-auth.guard';
import { UsuarioAutenticado } from '../../../../compartido/tipos/usuario-autenticado.interface';
import { NotificacionesService } from '../../aplicacion/notificaciones.service';

/** Las notificaciones son siempre del propio usuario autenticado: sólo exige JwtAuthGuard. */
@Controller('notificaciones')
@UseGuards(JwtAuthGuard)
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Get()
  listarMias(@UsuarioActual() usuario: UsuarioAutenticado) {
    return this.notificacionesService.listarMias(usuario.id);
  }

  @Get('no-leidas')
  async contarNoLeidas(@UsuarioActual() usuario: UsuarioAutenticado) {
    const cantidad = await this.notificacionesService.contarNoLeidas(usuario.id);
    return { cantidad };
  }

  @Patch(':id/leida')
  @HttpCode(HttpStatus.NO_CONTENT)
  async marcarLeida(@UsuarioActual() usuario: UsuarioAutenticado, @Param('id') id: string): Promise<void> {
    await this.notificacionesService.marcarLeida(id, usuario.id);
  }

  @Patch('leer-todas')
  @HttpCode(HttpStatus.NO_CONTENT)
  async marcarTodasLeidas(@UsuarioActual() usuario: UsuarioAutenticado): Promise<void> {
    await this.notificacionesService.marcarTodasLeidas(usuario.id);
  }
}
