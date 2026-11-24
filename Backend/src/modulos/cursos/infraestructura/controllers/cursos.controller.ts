import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { InstitucionActual } from '../../../../compartido/decoradores/institucion-actual.decorator';
import { Roles } from '../../../../compartido/decoradores/roles.decorator';
import { UsuarioActual } from '../../../../compartido/decoradores/usuario-actual.decorator';
import { InstitucionGuard } from '../../../../compartido/guards/institucion.guard';
import { JwtAuthGuard } from '../../../../compartido/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../compartido/guards/roles.guard';
import { RolUsuario } from '../../../../compartido/tipos/rol.enum';
import { UsuarioAutenticado } from '../../../../compartido/tipos/usuario-autenticado.interface';
import { CursosService } from '../../aplicacion/cursos.service';
import { ActualizarCursoDto } from '../dto/actualizar-curso.dto';
import { CrearCursoDto } from '../dto/crear-curso.dto';

@Controller('cursos')
@UseGuards(JwtAuthGuard, RolesGuard, InstitucionGuard)
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Post()
  @Roles(RolUsuario.COORDINADOR)
  crear(@InstitucionActual() institucionId: string, @Body() dto: CrearCursoDto) {
    return this.cursosService.crear(institucionId, dto);
  }

  @Get()
  @Roles(RolUsuario.COORDINADOR, RolUsuario.PROFESOR, RolUsuario.ESTUDIANTE)
  listar(@InstitucionActual() institucionId: string, @UsuarioActual() usuario: UsuarioAutenticado) {
    if (usuario.rol === RolUsuario.PROFESOR) {
      return this.cursosService.listarPropios(institucionId, usuario.id);
    }
    return this.cursosService.listar(institucionId);
  }

  @Get(':id')
  @Roles(RolUsuario.COORDINADOR, RolUsuario.PROFESOR, RolUsuario.ESTUDIANTE)
  obtener(@InstitucionActual() institucionId: string, @Param('id') id: string) {
    return this.cursosService.obtener(institucionId, id);
  }

  @Patch(':id')
  @Roles(RolUsuario.COORDINADOR)
  actualizar(
    @InstitucionActual() institucionId: string,
    @Param('id') id: string,
    @Body() dto: ActualizarCursoDto,
  ) {
    return this.cursosService.actualizar(institucionId, id, dto);
  }

  @Delete(':id')
  @Roles(RolUsuario.COORDINADOR)
  eliminar(@InstitucionActual() institucionId: string, @Param('id') id: string) {
    return this.cursosService.eliminar(institucionId, id);
  }
}
