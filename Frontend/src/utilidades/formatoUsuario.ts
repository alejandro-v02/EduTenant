import type { TipoDocumento, Usuario } from '../tipos/tipos';

export const ETIQUETAS_TIPO_DOCUMENTO: Record<TipoDocumento, string> = {
  cedula_ciudadania: 'Cédula de ciudadanía',
  cedula_extranjeria: 'Cédula de extranjería',
  tarjeta_identidad: 'Tarjeta de identidad',
  pasaporte: 'Pasaporte',
};

export function nombreCompleto(usuario: Pick<Usuario, 'nombre' | 'apellido'>): string {
  return usuario.apellido ? `${usuario.nombre} ${usuario.apellido}` : usuario.nombre;
}

/** Mismo criterio que usa el backend al iniciar sesión para decidir si debe completar su perfil. */
export function perfilEstaCompleto(usuario: Usuario): boolean {
  return Boolean(
    usuario.apellido &&
      usuario.tipoDocumento &&
      usuario.numeroDocumento &&
      usuario.telefono &&
      usuario.direccion &&
      usuario.departamento &&
      usuario.municipio,
  );
}
