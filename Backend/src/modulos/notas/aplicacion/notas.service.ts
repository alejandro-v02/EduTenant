import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TipoNotificacion } from '../../../compartido/tipos/tipo-notificacion.enum';
import { UMBRAL_NOTA_BAJA } from '../../../compartido/tipos/umbrales';
import { CorreoService } from '../../correo/aplicacion/correo.service';
import { CursoRepositorio } from '../../cursos/dominio/curso.repositorio';
import { MatriculaRepositorio } from '../../matriculas/dominio/matricula.repositorio';
import { NotificacionesService } from '../../notificaciones/aplicacion/notificaciones.service';
import { UsuarioRepositorio } from '../../usuarios/dominio/usuario.repositorio';
import { Nota } from '../dominio/nota.entity';
import { NotaRepositorio } from '../dominio/nota.repositorio';

@Injectable()
export class NotasService {
  constructor(
    private readonly notaRepositorio: NotaRepositorio,
    private readonly cursoRepositorio: CursoRepositorio,
    private readonly matriculaRepositorio: MatriculaRepositorio,
    private readonly usuarioRepositorio: UsuarioRepositorio,
    private readonly correoService: CorreoService,
    private readonly notificacionesService: NotificacionesService,
  ) {}

  async crear(
    institucionId: string,
    profesorId: string,
    cursoId: string,
    estudianteId: string,
    valor: number,
    descripcion: string,
    fecha: Date,
  ): Promise<Nota> {
    const curso = await this.validarCursoDelProfesor(institucionId, profesorId, cursoId);

    const matriculado = await this.matriculaRepositorio.existe(institucionId, cursoId, estudianteId);
    if (!matriculado) {
      throw new ForbiddenException('El estudiante no está matriculado en este curso');
    }

    const nota = await this.notaRepositorio.crear({ institucionId, cursoId, estudianteId, valor, descripcion, fecha });

    if (valor < UMBRAL_NOTA_BAJA) {
      const estudiante = await this.usuarioRepositorio.buscarPorId(estudianteId);
      if (estudiante) {
        await Promise.all([
          this.correoService.enviarAvisoNotaBaja(estudiante.email, estudiante.nombre, curso.nombre, valor, descripcion),
          this.notificacionesService.crear({
            institucionId,
            usuarioId: estudiante.id,
            tipo: TipoNotificacion.NOTA_BAJA,
            titulo: `Nota baja en ${curso.nombre}`,
            mensaje: `Te registraron ${valor} en "${descripcion}".`,
            enlace: '/estudiante/notas',
          }),
        ]);
      }
    }

    return nota;
  }

  async actualizar(
    institucionId: string,
    profesorId: string,
    id: string,
    cambios: { valor?: number; descripcion?: string },
  ): Promise<Nota> {
    const nota = await this.notaRepositorio.buscarPorIdEnInstitucion(id, institucionId);
    if (!nota) {
      throw new NotFoundException('Nota no encontrada');
    }
    await this.validarCursoDelProfesor(institucionId, profesorId, nota.cursoId);
    return this.notaRepositorio.actualizar(id, institucionId, cambios);
  }

  async listarPorCurso(institucionId: string, cursoId: string, profesorId?: string): Promise<Nota[]> {
    const curso = await this.cursoRepositorio.buscarPorIdEnInstitucion(cursoId, institucionId);
    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }
    if (profesorId && curso.profesorId !== profesorId) {
      throw new ForbiddenException('No tienes permisos sobre este curso');
    }
    return this.notaRepositorio.listarPorCurso(institucionId, cursoId);
  }

  listarPropias(institucionId: string, estudianteId: string): Promise<Nota[]> {
    return this.notaRepositorio.listarPorEstudiante(institucionId, estudianteId);
  }

  private async validarCursoDelProfesor(institucionId: string, profesorId: string, cursoId: string) {
    const curso = await this.cursoRepositorio.buscarPorIdEnInstitucion(cursoId, institucionId);
    if (!curso || curso.profesorId !== profesorId) {
      throw new ForbiddenException('No tienes permisos sobre este curso');
    }
    return curso;
  }
}
