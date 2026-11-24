import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { RolUsuario } from '../../../compartido/tipos/rol.enum';
import { CursoRepositorio } from '../../cursos/dominio/curso.repositorio';
import { UsuarioRepositorio } from '../../usuarios/dominio/usuario.repositorio';
import { Matricula } from '../dominio/matricula.entity';
import { MatriculaRepositorio } from '../dominio/matricula.repositorio';

@Injectable()
export class MatriculasService {
  constructor(
    private readonly matriculaRepositorio: MatriculaRepositorio,
    private readonly cursoRepositorio: CursoRepositorio,
    private readonly usuarioRepositorio: UsuarioRepositorio,
  ) {}

  async matricular(institucionId: string, cursoId: string, estudianteId: string): Promise<Matricula> {
    const curso = await this.cursoRepositorio.buscarPorIdEnInstitucion(cursoId, institucionId);
    if (!curso) {
      throw new ForbiddenException('El curso indicado no pertenece a esta institución');
    }

    const estudiante = await this.usuarioRepositorio.buscarPorIdEnInstitucion(estudianteId, institucionId);
    if (!estudiante || estudiante.rol !== RolUsuario.ESTUDIANTE) {
      throw new ForbiddenException('El estudiante indicado no pertenece a esta institución');
    }

    const yaMatriculado = await this.matriculaRepositorio.existe(institucionId, cursoId, estudianteId);
    if (yaMatriculado) {
      throw new ConflictException('El estudiante ya está matriculado en este curso');
    }

    return this.matriculaRepositorio.crear({ institucionId, cursoId, estudianteId });
  }

  listarPorCurso(institucionId: string, cursoId: string): Promise<Matricula[]> {
    return this.matriculaRepositorio.listarPorCurso(institucionId, cursoId);
  }

  listarPorEstudiante(institucionId: string, estudianteId: string): Promise<Matricula[]> {
    return this.matriculaRepositorio.listarPorEstudiante(institucionId, estudianteId);
  }

  retirar(institucionId: string, id: string): Promise<void> {
    return this.matriculaRepositorio.eliminar(id, institucionId);
  }
}
