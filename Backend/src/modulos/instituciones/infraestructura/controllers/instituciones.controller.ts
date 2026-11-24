import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { InstitucionActual } from '../../../../compartido/decoradores/institucion-actual.decorator';
import { Roles } from '../../../../compartido/decoradores/roles.decorator';
import { InstitucionGuard } from '../../../../compartido/guards/institucion.guard';
import { JwtAuthGuard } from '../../../../compartido/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../compartido/guards/roles.guard';
import { RolUsuario } from '../../../../compartido/tipos/rol.enum';
import { InstitucionesService } from '../../aplicacion/instituciones.service';
import { ActualizarInstitucionDto } from '../dto/actualizar-institucion.dto';

/**
 * Sólo expone la institución del propio usuario autenticado (@InstitucionActual()).
 * La gestión entre instituciones (listar todas, crear) vive en el módulo
 * superadministrador, el único autorizado a operar fuera de su propio tenant.
 */
@Controller('instituciones')
@UseGuards(JwtAuthGuard, RolesGuard, InstitucionGuard)
export class InstitucionesController {
  constructor(private readonly institucionesService: InstitucionesService) {}

  @Get('actual')
  @Roles(RolUsuario.COORDINADOR, RolUsuario.PROFESOR, RolUsuario.ESTUDIANTE)
  obtenerActual(@InstitucionActual() institucionId: string) {
    return this.institucionesService.obtenerActual(institucionId);
  }

  @Patch('actual')
  @Roles(RolUsuario.COORDINADOR)
  actualizarActual(@InstitucionActual() institucionId: string, @Body() dto: ActualizarInstitucionDto) {
    return this.institucionesService.actualizarActual(institucionId, dto);
  }
}
