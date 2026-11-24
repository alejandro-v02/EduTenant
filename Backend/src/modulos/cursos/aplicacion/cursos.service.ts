import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { RolUsuario } from '../../../compartido/tipos/rol.enum';
import { UsuarioRepositorio } from '../../usuarios/dominio/usuario.repositorio';
import { Curso } from '../dominio/curso.entity';
import { CursoRepositorio } from '../dominio/curso.repositorio';

interface DatosCurso {
  nombre: string;
  descripcion?: string;
  profesorId?: string;
}

@Injectable()
export class CursosService {
  constructor(
    private readonly cursoRepositorio: CursoRepositorio,
    private readonly usuarioRepositorio: UsuarioRepositorio,
  ) {}

  async crear(institucionId: string, datos: DatosCurso): Promise<Curso> {
    if (datos.profesorId) {
      await this.validarProfesorDeInstitucion(institucionId, datos.profesorId);
    }

    return this.cursoRepositorio.crear({
      institucionId,
      nombre: datos.nombre,
      descripcion: datos.descripcion ?? null,
      profesorId: datos.profesorId ?? null,
    });
  }

  listar(institucionId: string): Promise<Curso[]> {
    return this.cursoRepositorio.listarPorInstitucion(institucionId);
  }

  listarPropios(institucionId: string, profesorId: string): Promise<Curso[]> {
    return this.cursoRepositorio.listarPorProfesor(institucionId, profesorId);
  }

  async obtener(institucionId: string, id: string): Promise<Curso> {
    const curso = await this.cursoRepositorio.buscarPorIdEnInstitucion(id, institucionId);
    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }
    return curso;
  }

  async actualizar(institucionId: string, id: string, datos: Partial<DatosCurso>): Promise<Curso> {
    if (datos.profesorId) {
      await this.validarProfesorDeInstitucion(institucionId, datos.profesorId);
    }
    return this.cursoRepositorio.actualizar(id, institucionId, datos);
  }

  eliminar(institucionId: string, id: string): Promise<void> {
    return this.cursoRepositorio.eliminar(id, institucionId);
  }

  private async validarProfesorDeInstitucion(institucionId: string, profesorId: string): Promise<void> {
    const profesor = await this.usuarioRepositorio.buscarPorIdEnInstitucion(profesorId, institucionId);
    if (!profesor || profesor.rol !== RolUsuario.PROFESOR) {
      throw new ForbiddenException('El profesor indicado no pertenece a esta institución');
    }
  }
}
