export type Rol = 'superadministrador' | 'coordinador' | 'profesor' | 'estudiante';

export type EstadoAsistencia = 'presente' | 'ausente' | 'tarde';

export type TipoDocumento = 'cedula_ciudadania' | 'cedula_extranjeria' | 'tarjeta_identidad' | 'pasaporte';

export interface UsuarioSesion {
  id: string;
  nombre: string;
  apellido: string | null;
  email: string;
  rol: Rol;
  institucionId: string | null;
  perfilCompleto: boolean;
}

export interface RespuestaLogin {
  tokenAcceso: string;
  usuario: UsuarioSesion;
}

export interface Usuario {
  id: string;
  institucionId: string | null;
  nombre: string;
  apellido: string | null;
  email: string;
  rol: Rol;
  activo: boolean;
  tipoDocumento: TipoDocumento | null;
  numeroDocumento: string | null;
  telefono: string | null;
  direccion: string | null;
  departamento: string | null;
  municipio: string | null;
  fechaNacimiento: string | null;
  creadoEn: string | null;
}

export interface Institucion {
  id: string;
  nombre: string;
  slug: string;
  plan: string;
  activo: boolean;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  departamento: string | null;
  municipio: string | null;
  descripcion: string | null;
  creadoEn: string | null;
}

export interface ResumenInstitucion {
  institucion: Institucion;
  coordinadores: Usuario[];
  totalProfesores: number;
  totalEstudiantes: number;
  totalCursos: number;
}

export interface Curso {
  id: string;
  institucionId: string;
  nombre: string;
  descripcion: string | null;
  profesorId: string | null;
}

export interface Matricula {
  id: string;
  institucionId: string;
  cursoId: string;
  estudianteId: string;
  fechaMatricula: string;
}

export interface Nota {
  id: string;
  institucionId: string;
  cursoId: string;
  estudianteId: string;
  valor: number;
  descripcion: string;
  fecha: string;
}

export interface Asistencia {
  id: string;
  institucionId: string;
  cursoId: string;
  estudianteId: string;
  fecha: string;
  estado: EstadoAsistencia;
}

export interface Material {
  id: string;
  institucionId: string;
  cursoId: string;
  titulo: string;
  archivoUrl: string;
  publicadoPor: string;
  fecha: string;
}

export interface DatosCrearInstitucion {
  nombreInstitucion: string;
  slug: string;
  plan?: string;
  direccionInstitucion: string;
  telefonoInstitucion: string;
  emailInstitucion: string;
  departamentoInstitucion: string;
  municipioInstitucion: string;
  descripcionInstitucion?: string;
  nombreCoordinador: string;
  apellidoCoordinador: string;
  tipoDocumentoCoordinador: TipoDocumento;
  numeroDocumentoCoordinador: string;
  telefonoCoordinador: string;
  direccionCoordinador: string;
  departamentoCoordinador: string;
  municipioCoordinador: string;
  fechaNacimientoCoordinador?: string;
  emailCoordinador: string;
  claveCoordinador: string;
}

export interface ResultadoCrearInstitucion {
  institucion: Institucion;
  coordinador: Usuario;
}

export interface DatosActualizarInstitucion {
  nombre?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  departamento?: string;
  municipio?: string;
  descripcion?: string;
}

export type TipoNotificacion = 'inasistencia' | 'nota_baja' | 'material_nuevo';

export interface NotificacionApp {
  id: string;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  enlace: string | null;
  leida: boolean;
  creadaEn: string;
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
  fechaNacimiento?: string;
}
