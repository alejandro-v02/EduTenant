/**
 * Guarda el token JWT en memoria (variable de módulo), nunca en localStorage/sessionStorage.
 * SesionContext es la única fuente de verdad para React; este módulo permite que el
 * interceptor de Axios (fuera del árbol de React) acceda al token vigente.
 */
let tokenActual: string | null = null;
let manejadorExpiracion: (() => void) | null = null;

export function establecerToken(token: string | null): void {
  tokenActual = token;
}

export function obtenerToken(): string | null {
  return tokenActual;
}

export function registrarManejadorExpiracion(manejador: () => void): void {
  manejadorExpiracion = manejador;
}

export function notificarExpiracion(): void {
  manejadorExpiracion?.();
}
