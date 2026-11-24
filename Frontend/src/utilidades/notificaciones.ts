export type TipoNotificacion = 'exito' | 'error';

export interface Notificacion {
  id: string;
  tipo: TipoNotificacion;
  mensaje: string;
}

type Escucha = (notificaciones: Notificacion[]) => void;

let notificaciones: Notificacion[] = [];
const escuchas = new Set<Escucha>();

function emitir(): void {
  escuchas.forEach((escucha) => escucha(notificaciones));
}

/** Punto único de entrada: cualquier acción (crear, guardar, eliminar) llama esto al terminar. */
export function notificar(tipo: TipoNotificacion, mensaje: string): void {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  notificaciones = [...notificaciones, { id, tipo, mensaje }];
  emitir();
}

export function descartarNotificacion(id: string): void {
  notificaciones = notificaciones.filter((n) => n.id !== id);
  emitir();
}

export function suscribirseANotificaciones(escucha: Escucha): () => void {
  escuchas.add(escucha);
  escucha(notificaciones);
  return () => {
    escuchas.delete(escucha);
  };
}
