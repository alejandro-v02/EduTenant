import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TipoDocumento } from '../../../compartido/tipos/tipo-documento.enum';
import { aUsuarioPublico, UsuarioPublico } from '../../usuarios/dominio/usuario.entity';
import { UsuarioRepositorio } from '../../usuarios/dominio/usuario.repositorio';

interface DatosActualizarPerfil {
  nombre?: string;
  apellido?: string;
  tipoDocumento?: TipoDocumento;
  numeroDocumento?: string;
  telefono?: string;
  direccion?: string;
  departamento?: string;
  municipio?: string;
  fechaNacimiento?: string;
}

@Injectable()
export class PerfilService {
  constructor(private readonly usuarioRepositorio: UsuarioRepositorio) {}

  async obtener(usuarioId: string): Promise<UsuarioPublico> {
    const usuario = await this.usuarioRepositorio.buscarPorId(usuarioId);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return aUsuarioPublico(usuario);
  }

  async actualizar(usuarioId: string, cambios: DatosActualizarPerfil): Promise<UsuarioPublico> {
    const actualizado = await this.usuarioRepositorio.actualizarPerfil(usuarioId, {
      ...cambios,
      fechaNacimiento: cambios.fechaNacimiento !== undefined ? new Date(cambios.fechaNacimiento) : undefined,
    });
    return aUsuarioPublico(actualizado);
  }

  async cambiarClave(usuarioId: string, claveActual: string, claveNueva: string): Promise<void> {
    const usuario = await this.usuarioRepositorio.buscarPorId(usuarioId);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const claveValida = await bcrypt.compare(claveActual, usuario.passwordHash);
    if (!claveValida) {
      throw new UnauthorizedException('La contraseña actual no es correcta');
    }

    const passwordHash = await bcrypt.hash(claveNueva, 10);
    await this.usuarioRepositorio.actualizarPasswordHash(usuarioId, passwordHash);
  }
}
