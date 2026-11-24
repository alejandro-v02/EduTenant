import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../../../../compartido/decoradores/roles.decorator';
import { JwtAuthGuard } from '../../../../compartido/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../compartido/guards/roles.guard';
import { RolUsuario } from '../../../../compartido/tipos/rol.enum';
import { SuperadministradorService } from '../../aplicacion/superadministrador.service';
import { CrearInstitucionDto } from '../dto/crear-institucion.dto';

/**
 * Único controller que opera entre instituciones. No usa InstitucionGuard:
 * el superadministrador no pertenece a ninguna (institucionId nulo en su JWT).
 */
@Controller('superadministrador')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.SUPERADMINISTRADOR)
export class SuperadministradorController {
  constructor(private readonly superadministradorService: SuperadministradorService) {}

  @Post('instituciones')
  crearInstitucion(@Body() dto: CrearInstitucionDto) {
    return this.superadministradorService.crearInstitucionConCoordinador(dto);
  }

  @Get('instituciones')
  listarInstituciones() {
    return this.superadministradorService.listarInstituciones();
  }

  @Get('instituciones/:id')
  obtenerInstitucion(@Param('id') id: string) {
    return this.superadministradorService.obtenerInstitucion(id);
  }
}
