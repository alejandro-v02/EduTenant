import { DatosCrearNotificacion, Notificacion } from './notificacion.entity';

/** Puerto (contrato) que implementa la infraestructura de persistencia. */
export abstract class NotificacionRepositorio {
  abstract crear(datos: DatosCrearNotificacion): Promise<Notificacion>;
  abstract listarPorUsuario(usuarioId: string, limite: number): Promise<Notificacion[]>;
  abstract contarNoLeidas(usuarioId: string): Promise<number>;
  abstract marcarLeida(id: string, usuarioId: string): Promise<void>;
  abstract marcarTodasLeidas(usuarioId: string): Promise<void>;
}
