import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { InstitucionActual } from '../../../../compartido/decoradores/institucion-actual.decorator';
import { Roles } from '../../../../compartido/decoradores/roles.decorator';
import { UsuarioActual } from '../../../../compartido/decoradores/usuario-actual.decorator';
import { InstitucionGuard } from '../../../../compartido/guards/institucion.guard';
import { JwtAuthGuard } from '../../../../compartido/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../compartido/guards/roles.guard';
import { RolUsuario } from '../../../../compartido/tipos/rol.enum';
import { UsuarioAutenticado } from '../../../../compartido/tipos/usuario-autenticado.interface';
import { NotasService } from '../../aplicacion/notas.service';
import { ActualizarNotaDto } from '../dto/actualizar-nota.dto';
import { CrearNotaDto } from '../dto/crear-nota.dto';

@Controller('notas')
@UseGuards(JwtAuthGuard, RolesGuard, InstitucionGuard)
export class NotasController {
  constructor(private readonly notasService: NotasService) {}

  @Post()
  @Roles(RolUsuario.PROFESOR)
  crear(
    @InstitucionActual() institucionId: string,
    @UsuarioActual() usuario: UsuarioAutenticado,
    @Body() dto: CrearNotaDto,
  ) {
    return this.notasService.crear(
      institucionId,
      usuario.id,
      dto.cursoId,
      dto.estudianteId,
      dto.valor,
      dto.descripcion,
      new Date(dto.fecha),
    );
  }

  @Patch(':id')
  @Roles(RolUsuario.PROFESOR)
  actualizar(
    @InstitucionActual() institucionId: string,
    @UsuarioActual() usuario: UsuarioAutenticado,
    @Param('id') id: string,
    @Body() dto: ActualizarNotaDto,
  ) {
    return this.notasService.actualizar(institucionId, usuario.id, id, dto);
  }

  @Get('curso/:cursoId')
  @Roles(RolUsuario.COORDINADOR, RolUsuario.PROFESOR)
  listarPorCurso(
    @InstitucionActual() institucionId: string,
    @UsuarioActual() usuario: UsuarioAutenticado,
    @Param('cursoId') cursoId: string,
  ) {
    const profesorId = usuario.rol === RolUsuario.PROFESOR ? usuario.id : undefined;
    return this.notasService.listarPorCurso(institucionId, cursoId, profesorId);
  }

  @Get('mias')
  @Roles(RolUsuario.ESTUDIANTE)
  listarPropias(@InstitucionActual() institucionId: string, @UsuarioActual() usuario: UsuarioAutenticado) {
    return this.notasService.listarPropias(institucionId, usuario.id);
  }
}
