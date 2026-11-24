import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { InstitucionActual } from '../../../../compartido/decoradores/institucion-actual.decorator';
import { Roles } from '../../../../compartido/decoradores/roles.decorator';
import { UsuarioActual } from '../../../../compartido/decoradores/usuario-actual.decorator';
import { InstitucionGuard } from '../../../../compartido/guards/institucion.guard';
import { JwtAuthGuard } from '../../../../compartido/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../compartido/guards/roles.guard';
import { RolUsuario } from '../../../../compartido/tipos/rol.enum';
import { UsuarioAutenticado } from '../../../../compartido/tipos/usuario-autenticado.interface';
import { MaterialesService } from '../../aplicacion/materiales.service';
import { CrearMaterialDto } from '../dto/crear-material.dto';

@Controller('materiales')
@UseGuards(JwtAuthGuard, RolesGuard, InstitucionGuard)
export class MaterialesController {
  constructor(private readonly materialesService: MaterialesService) {}

  @Post()
  @Roles(RolUsuario.PROFESOR)
  publicar(
    @InstitucionActual() institucionId: string,
    @UsuarioActual() usuario: UsuarioAutenticado,
    @Body() dto: CrearMaterialDto,
  ) {
    return this.materialesService.publicar(institucionId, usuario.id, dto.cursoId, dto.titulo, dto.archivoUrl);
  }

  @Get('curso/:cursoId')
  @Roles(RolUsuario.COORDINADOR, RolUsuario.PROFESOR, RolUsuario.ESTUDIANTE)
  listarPorCurso(
    @InstitucionActual() institucionId: string,
    @UsuarioActual() usuario: UsuarioAutenticado,
    @Param('cursoId') cursoId: string,
  ) {
    return this.materialesService.listarPorCurso(institucionId, cursoId, {
      id: usuario.id,
      esProfesor: usuario.rol === RolUsuario.PROFESOR,
      esEstudiante: usuario.rol === RolUsuario.ESTUDIANTE,
    });
  }

  @Delete('curso/:cursoId/:id')
  @Roles(RolUsuario.PROFESOR)
  eliminar(
    @InstitucionActual() institucionId: string,
    @UsuarioActual() usuario: UsuarioAutenticado,
    @Param('cursoId') cursoId: string,
    @Param('id') id: string,
  ) {
    return this.materialesService.eliminar(institucionId, usuario.id, cursoId, id);
  }
}
