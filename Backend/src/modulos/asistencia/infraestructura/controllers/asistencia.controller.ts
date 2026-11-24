import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { InstitucionActual } from '../../../../compartido/decoradores/institucion-actual.decorator';
import { Roles } from '../../../../compartido/decoradores/roles.decorator';
import { UsuarioActual } from '../../../../compartido/decoradores/usuario-actual.decorator';
import { InstitucionGuard } from '../../../../compartido/guards/institucion.guard';
import { JwtAuthGuard } from '../../../../compartido/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../compartido/guards/roles.guard';
import { RolUsuario } from '../../../../compartido/tipos/rol.enum';
import { UsuarioAutenticado } from '../../../../compartido/tipos/usuario-autenticado.interface';
import { AsistenciaService } from '../../aplicacion/asistencia.service';
import { RegistrarAsistenciaDto } from '../dto/registrar-asistencia.dto';

@Controller('asistencia')
@UseGuards(JwtAuthGuard, RolesGuard, InstitucionGuard)
export class AsistenciaController {
  constructor(private readonly asistenciaService: AsistenciaService) {}

  @Post()
  @Roles(RolUsuario.PROFESOR)
  registrar(
    @InstitucionActual() institucionId: string,
    @UsuarioActual() usuario: UsuarioAutenticado,
    @Body() dto: RegistrarAsistenciaDto,
  ) {
    return this.asistenciaService.registrar(
      institucionId,
      usuario.id,
      dto.cursoId,
      dto.estudianteId,
      new Date(dto.fecha),
      dto.estado,
    );
  }

  @Get('curso/:cursoId')
  @Roles(RolUsuario.COORDINADOR, RolUsuario.PROFESOR)
  listarPorCurso(
    @InstitucionActual() institucionId: string,
    @UsuarioActual() usuario: UsuarioAutenticado,
    @Param('cursoId') cursoId: string,
  ) {
    const profesorId = usuario.rol === RolUsuario.PROFESOR ? usuario.id : undefined;
    return this.asistenciaService.listarPorCurso(institucionId, cursoId, profesorId);
  }

  @Get('mia')
  @Roles(RolUsuario.ESTUDIANTE)
  listarPropia(@InstitucionActual() institucionId: string, @UsuarioActual() usuario: UsuarioAutenticado) {
    return this.asistenciaService.listarPropia(institucionId, usuario.id);
  }
}
