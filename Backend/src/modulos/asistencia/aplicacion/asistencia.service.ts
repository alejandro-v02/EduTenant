import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EstadoAsistencia } from '../../../compartido/tipos/estado-asistencia.enum';
import { TipoNotificacion } from '../../../compartido/tipos/tipo-notificacion.enum';
import { CorreoService } from '../../correo/aplicacion/correo.service';
import { CursoRepositorio } from '../../cursos/dominio/curso.repositorio';
import { MatriculaRepositorio } from '../../matriculas/dominio/matricula.repositorio';
import { NotificacionesService } from '../../notificaciones/aplicacion/notificaciones.service';
import { UsuarioRepositorio } from '../../usuarios/dominio/usuario.repositorio';
import { Asistencia } from '../dominio/asistencia.entity';
import { AsistenciaRepositorio } from '../dominio/asistencia.repositorio';

@Injectable()
export class AsistenciaService {
  constructor(
    private readonly asistenciaRepositorio: AsistenciaRepositorio,
    private readonly cursoRepositorio: CursoRepositorio,
    private readonly matriculaRepositorio: MatriculaRepositorio,
    private readonly usuarioRepositorio: UsuarioRepositorio,
    private readonly correoService: CorreoService,
    private readonly notificacionesService: NotificacionesService,
  ) {}

  async registrar(
    institucionId: string,
    profesorId: string,
    cursoId: string,
    estudianteId: string,
    fecha: Date,
    estado: EstadoAsistencia,
  ): Promise<Asistencia> {
    await this.validarCursoDelProfesor(institucionId, profesorId, cursoId);

    const matriculado = await this.matriculaRepositorio.existe(institucionId, cursoId, estudianteId);
    if (!matriculado) {
      throw new ForbiddenException('El estudiante no está matriculado en este curso');
    }

    const existente = await this.asistenciaRepositorio.buscarPorCursoFechaEstudiante(
      institucionId,
      cursoId,
      estudianteId,
      fecha,
    );

    const registro = existente
      ? await this.asistenciaRepositorio.actualizarEstado(existente.id, institucionId, estado)
      : await this.asistenciaRepositorio.registrar({ institucionId, cursoId, estudianteId, fecha, estado });

    if (estado === EstadoAsistencia.AUSENTE) {
      await this.avisarInasistencia(institucionId, cursoId, estudianteId, fecha);
    }

    return registro;
  }

  private async avisarInasistencia(institucionId: string, cursoId: string, estudianteId: string, fecha: Date): Promise<void> {
    const [curso, estudiante] = await Promise.all([
      this.cursoRepositorio.buscarPorIdEnInstitucion(cursoId, institucionId),
      this.usuarioRepositorio.buscarPorId(estudianteId),
    ]);
    if (!curso || !estudiante) return;

    // `fecha` viene de un ISO 'YYYY-MM-DD' (medianoche UTC): usar getters UTC evita que
    // el desfase de zona horaria del servidor (ej. America/Bogota) corra el día un día atrás.
    const fechaLegible = [
      String(fecha.getUTCDate()).padStart(2, '0'),
      String(fecha.getUTCMonth() + 1).padStart(2, '0'),
      fecha.getUTCFullYear(),
    ].join('/');

    await Promise.all([
      this.correoService.enviarAvisoInasistencia(estudiante.email, estudiante.nombre, curso.nombre, fechaLegible),
      this.notificacionesService.crear({
        institucionId: curso.institucionId,
        usuarioId: estudiante.id,
        tipo: TipoNotificacion.INASISTENCIA,
        titulo: `Inasistencia en ${curso.nombre}`,
        mensaje: `Se registró tu inasistencia del ${fechaLegible}.`,
        enlace: '/estudiante/asistencia',
      }),
    ]);
  }

  async listarPorCurso(institucionId: string, cursoId: string, profesorId?: string): Promise<Asistencia[]> {
    const curso = await this.cursoRepositorio.buscarPorIdEnInstitucion(cursoId, institucionId);
    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }
    if (profesorId && curso.profesorId !== profesorId) {
      throw new ForbiddenException('No tienes permisos sobre este curso');
    }
    return this.asistenciaRepositorio.listarPorCurso(institucionId, cursoId);
  }

  listarPropia(institucionId: string, estudianteId: string): Promise<Asistencia[]> {
    return this.asistenciaRepositorio.listarPorEstudiante(institucionId, estudianteId);
  }

  private async validarCursoDelProfesor(institucionId: string, profesorId: string, cursoId: string): Promise<void> {
    const curso = await this.cursoRepositorio.buscarPorIdEnInstitucion(cursoId, institucionId);
    if (!curso || curso.profesorId !== profesorId) {
      throw new ForbiddenException('No tienes permisos sobre este curso');
    }
  }
}
