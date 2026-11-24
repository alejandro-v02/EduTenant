import { RolUsuario } from '../../../compartido/tipos/rol.enum';
import { TipoDocumento } from '../../../compartido/tipos/tipo-documento.enum';

/** Entidad de dominio pura: sin decoradores de TypeORM ni de Nest. */
export class Usuario {
  constructor(
    public readonly id: string,
    public institucionId: string | null,
    public nombre: string,
    public apellido: string | null,
    public email: string,
    public passwordHash: string,
    public rol: RolUsuario,
    public activo: boolean = true,
    public tipoDocumento: TipoDocumento | null = null,
    public numeroDocumento: string | null = null,
    public telefono: string | null = null,
    public direccion: string | null = null,
    public departamento: string | null = null,
    public municipio: string | null = null,
    public fechaNacimiento: Date | null = null,
    public readonly creadoEn: Date | null = null,
  ) {}

  esSuperadministrador(): boolean {
    return this.rol === RolUsuario.SUPERADMINISTRADOR;
  }

  perteneceAInstitucion(institucionId: string): boolean {
    return this.institucionId === institucionId;
  }

  nombreCompleto(): string {
    return this.apellido ? `${this.nombre} ${this.apellido}` : this.nombre;
  }
}

/** Forma segura para exponer en respuestas HTTP: nunca incluye passwordHash. */
export interface UsuarioPublico {
  id: string;
  institucionId: string | null;
  nombre: string;
  apellido: string | null;
  email: string;
  rol: RolUsuario;
  activo: boolean;
  tipoDocumento: TipoDocumento | null;
  numeroDocumento: string | null;
  telefono: string | null;
  direccion: string | null;
  departamento: string | null;
  municipio: string | null;
  fechaNacimiento: Date | null;
  creadoEn: Date | null;
}

export function aUsuarioPublico(usuario: Usuario): UsuarioPublico {
  return {
    id: usuario.id,
    institucionId: usuario.institucionId,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    rol: usuario.rol,
    activo: usuario.activo,
    tipoDocumento: usuario.tipoDocumento,
    numeroDocumento: usuario.numeroDocumento,
    telefono: usuario.telefono,
    direccion: usuario.direccion,
    departamento: usuario.departamento,
    municipio: usuario.municipio,
    fechaNacimiento: usuario.fechaNacimiento,
    creadoEn: usuario.creadoEn,
  };
}
