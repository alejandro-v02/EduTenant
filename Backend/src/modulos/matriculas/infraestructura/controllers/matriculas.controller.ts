import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { InstitucionActual } from '../../../../compartido/decoradores/institucion-actual.decorator';
import { Roles } from '../../../../compartido/decoradores/roles.decorator';
import { UsuarioActual } from '../../../../compartido/decoradores/usuario-actual.decorator';
import { InstitucionGuard } from '../../../../compartido/guards/institucion.guard';
import { JwtAuthGuard } from '../../../../compartido/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../compartido/guards/roles.guard';
import { RolUsuario } from '../../../../compartido/tipos/rol.enum';
import { UsuarioAutenticado } from '../../../../compartido/tipos/usuario-autenticado.interface';
import { MatriculasService } from '../../aplicacion/matriculas.service';
import { CrearMatriculaDto } from '../dto/crear-matricula.dto';

@Controller('matriculas')
@UseGuards(JwtAuthGuard, RolesGuard, InstitucionGuard)
export class MatriculasController {
  constructor(private readonly matriculasService: MatriculasService) {}

  @Post()
  @Roles(RolUsuario.COORDINADOR)
  matricular(@InstitucionActual() institucionId: string, @Body() dto: CrearMatriculaDto) {
    return this.matriculasService.matricular(institucionId, dto.cursoId, dto.estudianteId);
  }

  @Get('curso/:cursoId')
  @Roles(RolUsuario.COORDINADOR, RolUsuario.PROFESOR)
  listarPorCurso(@InstitucionActual() institucionId: string, @Param('cursoId') cursoId: string) {
    return this.matriculasService.listarPorCurso(institucionId, cursoId);
  }

  @Get('mias')
  @Roles(RolUsuario.ESTUDIANTE)
  listarPropias(@InstitucionActual() institucionId: string, @UsuarioActual() usuario: UsuarioAutenticado) {
    return this.matriculasService.listarPorEstudiante(institucionId, usuario.id);
  }

  @Delete(':id')
  @Roles(RolUsuario.COORDINADOR)
  retirar(@InstitucionActual() institucionId: string, @Param('id') id: string) {
    return this.matriculasService.retirar(institucionId, id);
  }
}
