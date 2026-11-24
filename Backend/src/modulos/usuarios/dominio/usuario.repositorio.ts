import { RolUsuario } from '../../../compartido/tipos/rol.enum';
import { TipoDocumento } from '../../../compartido/tipos/tipo-documento.enum';
import { Usuario } from './usuario.entity';

export interface DatosCrearUsuario {
  institucionId: string | null;
  nombre: string;
  apellido?: string | null;
  email: string;
  passwordHash: string;
  rol: RolUsuario;
  tipoDocumento?: TipoDocumento | null;
  numeroDocumento?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  departamento?: string | null;
  municipio?: string | null;
  fechaNacimiento?: Date | null;
}

export interface DatosActualizarPerfil {
  nombre?: string;
  apellido?: string;
  tipoDocumento?: TipoDocumento;
  numeroDocumento?: string;
  telefono?: string;
  direccion?: string;
  departamento?: string;
  municipio?: string;
  fechaNacimiento?: Date | null;
}

/** Puerto (contrato) que implementa la infraestructura de persistencia. */
export abstract class UsuarioRepositorio {
  abstract crear(datos: DatosCrearUsuario): Promise<Usuario>;
  abstract buscarPorEmail(email: string): Promise<Usuario | null>;
  abstract buscarPorId(id: string): Promise<Usuario | null>;
  abstract buscarPorIdEnInstitucion(id: string, institucionId: string): Promise<Usuario | null>;
  abstract listarPorInstitucionYRol(institucionId: string, rol: RolUsuario): Promise<Usuario[]>;
  abstract actualizarPerfil(id: string, cambios: DatosActualizarPerfil): Promise<Usuario>;
  abstract actualizarPasswordHash(id: string, passwordHash: string): Promise<void>;
  abstract guardarTokenRecuperacion(usuarioId: string, tokenHash: string, expira: Date): Promise<void>;
  abstract buscarPorTokenRecuperacionValido(tokenHash: string): Promise<Usuario | null>;
  abstract limpiarTokenRecuperacion(usuarioId: string): Promise<void>;
}
