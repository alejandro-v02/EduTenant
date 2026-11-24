import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { InstitucionActual } from '../../../../compartido/decoradores/institucion-actual.decorator';
import { Roles } from '../../../../compartido/decoradores/roles.decorator';
import { InstitucionGuard } from '../../../../compartido/guards/institucion.guard';
import { JwtAuthGuard } from '../../../../compartido/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../compartido/guards/roles.guard';
import { RolUsuario } from '../../../../compartido/tipos/rol.enum';
import { UsuariosService } from '../../aplicacion/usuarios.service';
import { CrearEstudianteDto } from '../dto/crear-estudiante.dto';
import { CrearProfesorDto } from '../dto/crear-profesor.dto';
import { RestablecerClaveDto } from '../dto/restablecer-clave.dto';

/**
 * Todos los endpoints operan implícitamente sobre la institución del
 * coordinador autenticado (@InstitucionActual()); nunca se recibe
 * institucionId desde el cliente.
 */
@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard, InstitucionGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('profesores')
  @Roles(RolUsuario.COORDINADOR)
  crearProfesor(@InstitucionActual() institucionId: string, @Body() dto: CrearProfesorDto) {
    return this.usuariosService.crearProfesor(institucionId, dto);
  }

  @Get('profesores')
  @Roles(RolUsuario.COORDINADOR)
  listarProfesores(@InstitucionActual() institucionId: string) {
    return this.usuariosService.listarProfesores(institucionId);
  }

  @Post('estudiantes')
  @Roles(RolUsuario.COORDINADOR)
  crearEstudiante(@InstitucionActual() institucionId: string, @Body() dto: CrearEstudianteDto) {
    return this.usuariosService.crearEstudiante(institucionId, dto);
  }

  @Get('estudiantes')
  @Roles(RolUsuario.COORDINADOR, RolUsuario.PROFESOR)
  listarEstudiantes(@InstitucionActual() institucionId: string) {
    return this.usuariosService.listarEstudiantes(institucionId);
  }

  @Patch(':id/clave')
  @Roles(RolUsuario.COORDINADOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  async restablecerClave(
    @InstitucionActual() institucionId: string,
    @Param('id') id: string,
    @Body() dto: RestablecerClaveDto,
  ): Promise<void> {
    await this.usuariosService.restablecerClave(institucionId, id, dto.claveNueva);
  }
}
