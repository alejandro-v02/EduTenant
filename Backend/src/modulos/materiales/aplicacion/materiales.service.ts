import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TipoNotificacion } from '../../../compartido/tipos/tipo-notificacion.enum';
import { CorreoService } from '../../correo/aplicacion/correo.service';
import { CursoRepositorio } from '../../cursos/dominio/curso.repositorio';
import { MatriculaRepositorio } from '../../matriculas/dominio/matricula.repositorio';
import { NotificacionesService } from '../../notificaciones/aplicacion/notificaciones.service';
import { UsuarioRepositorio } from '../../usuarios/dominio/usuario.repositorio';
import { Material } from '../dominio/material.entity';
import { MaterialRepositorio } from '../dominio/material.repositorio';

interface Solicitante {
  id: string;
  esProfesor: boolean;
  esEstudiante: boolean;
}

@Injectable()
export class MaterialesService {
  constructor(
    private readonly materialRepositorio: MaterialRepositorio,
    private readonly cursoRepositorio: CursoRepositorio,
    private readonly matriculaRepositorio: MatriculaRepositorio,
    private readonly usuarioRepositorio: UsuarioRepositorio,
    private readonly correoService: CorreoService,
    private readonly notificacionesService: NotificacionesService,
  ) {}

  async publicar(
    institucionId: string,
    profesorId: string,
    cursoId: string,
    titulo: string,
    archivoUrl: string,
  ): Promise<Material> {
    const curso = await this.validarCursoDelProfesor(institucionId, profesorId, cursoId);

    const material = await this.materialRepositorio.crear({
      institucionId,
      cursoId,
      titulo,
      archivoUrl,
      publicadoPor: profesorId,
      fecha: new Date(),
    });

    await this.avisarMaterialNuevo(institucionId, cursoId, curso.nombre, titulo);

    return material;
  }

  private async avisarMaterialNuevo(institucionId: string, cursoId: string, nombreCurso: string, titulo: string): Promise<void> {
    const matriculas = await this.matriculaRepositorio.listarPorCurso(institucionId, cursoId);
    await Promise.all(
      matriculas.map(async (matricula) => {
        const estudiante = await this.usuarioRepositorio.buscarPorId(matricula.estudianteId);
        if (!estudiante) return;
        await Promise.all([
          this.correoService.enviarAvisoMaterialNuevo(estudiante.email, estudiante.nombre, nombreCurso, titulo),
          this.notificacionesService.crear({
            institucionId,
            usuarioId: estudiante.id,
            tipo: TipoNotificacion.MATERIAL_NUEVO,
            titulo: `Nuevo material en ${nombreCurso}`,
            mensaje: titulo,
            enlace: `/estudiante/cursos/${cursoId}/material`,
          }),
        ]);
      }),
    );
  }

  async listarPorCurso(institucionId: string, cursoId: string, solicitante: Solicitante): Promise<Material[]> {
    const curso = await this.cursoRepositorio.buscarPorIdEnInstitucion(cursoId, institucionId);
    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }

    if (solicitante.esProfesor && curso.profesorId !== solicitante.id) {
      throw new ForbiddenException('No tienes permisos sobre este curso');
    }

    if (solicitante.esEstudiante) {
      const matriculado = await this.matriculaRepositorio.existe(institucionId, cursoId, solicitante.id);
      if (!matriculado) {
        throw new ForbiddenException('No estás matriculado en este curso');
      }
    }

    return this.materialRepositorio.listarPorCurso(institucionId, cursoId);
  }

  async eliminar(institucionId: string, profesorId: string, cursoId: string, id: string): Promise<void> {
    await this.validarCursoDelProfesor(institucionId, profesorId, cursoId);
    return this.materialRepositorio.eliminar(id, institucionId);
  }

  private async validarCursoDelProfesor(institucionId: string, profesorId: string, cursoId: string) {
    const curso = await this.cursoRepositorio.buscarPorIdEnInstitucion(cursoId, institucionId);
    if (!curso || curso.profesorId !== profesorId) {
      throw new ForbiddenException('No tienes permisos sobre este curso');
    }
    return curso;
  }
}
