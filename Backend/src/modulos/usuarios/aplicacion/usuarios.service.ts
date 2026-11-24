import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RolUsuario } from '../../../compartido/tipos/rol.enum';
import { aUsuarioPublico, UsuarioPublico } from '../dominio/usuario.entity';
import { UsuarioRepositorio } from '../dominio/usuario.repositorio';

interface DatosNuevoUsuarioInstitucion {
  nombre: string;
  email: string;
  clave: string;
}

/** Casos de uso del coordinador para gestionar profesores y estudiantes de SU institución. */
@Injectable()
export class UsuariosService {
  constructor(private readonly usuarioRepositorio: UsuarioRepositorio) {}

  crearProfesor(institucionId: string, datos: DatosNuevoUsuarioInstitucion): Promise<UsuarioPublico> {
    return this.crearUsuarioEnInstitucion(institucionId, datos, RolUsuario.PROFESOR);
  }

  crearEstudiante(institucionId: string, datos: DatosNuevoUsuarioInstitucion): Promise<UsuarioPublico> {
    return this.crearUsuarioEnInstitucion(institucionId, datos, RolUsuario.ESTUDIANTE);
  }

  async listarProfesores(institucionId: string): Promise<UsuarioPublico[]> {
    const profesores = await this.usuarioRepositorio.listarPorInstitucionYRol(institucionId, RolUsuario.PROFESOR);
    return profesores.map(aUsuarioPublico);
  }

  async listarEstudiantes(institucionId: string): Promise<UsuarioPublico[]> {
    const estudiantes = await this.usuarioRepositorio.listarPorInstitucionYRol(institucionId, RolUsuario.ESTUDIANTE);
    return estudiantes.map(aUsuarioPublico);
  }

  /** El coordinador sólo puede restablecer la clave de profesores/estudiantes de su propia institución. */
  async restablecerClave(institucionId: string, usuarioId: string, claveNueva: string): Promise<void> {
    const usuario = await this.usuarioRepositorio.buscarPorIdEnInstitucion(usuarioId, institucionId);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado en esta institución');
    }
    if (usuario.rol !== RolUsuario.PROFESOR && usuario.rol !== RolUsuario.ESTUDIANTE) {
      throw new ForbiddenException('Sólo se puede restablecer la clave de profesores o estudiantes');
    }

    const passwordHash = await bcrypt.hash(claveNueva, 10);
    await this.usuarioRepositorio.actualizarPasswordHash(usuario.id, passwordHash);
  }

  private async crearUsuarioEnInstitucion(
    institucionId: string,
    datos: DatosNuevoUsuarioInstitucion,
    rol: RolUsuario,
  ): Promise<UsuarioPublico> {
    const existente = await this.usuarioRepositorio.buscarPorEmail(datos.email);
    if (existente) {
      throw new ConflictException('Ya existe un usuario registrado con ese email');
    }

    const passwordHash = await bcrypt.hash(datos.clave, 10);

    const creado = await this.usuarioRepositorio.crear({
      institucionId,
      nombre: datos.nombre,
      email: datos.email,
      passwordHash,
      rol,
    });

    return aUsuarioPublico(creado);
  }
}
