import { Injectable } from '@nestjs/common';
import { DatosCrearNotificacion, Notificacion } from '../dominio/notificacion.entity';
import { NotificacionRepositorio } from '../dominio/notificacion.repositorio';

const LIMITE_LISTADO = 30;

@Injectable()
export class NotificacionesService {
  constructor(private readonly notificacionRepositorio: NotificacionRepositorio) {}

  crear(datos: DatosCrearNotificacion): Promise<Notificacion> {
    return this.notificacionRepositorio.crear(datos);
  }

  listarMias(usuarioId: string): Promise<Notificacion[]> {
    return this.notificacionRepositorio.listarPorUsuario(usuarioId, LIMITE_LISTADO);
  }

  contarNoLeidas(usuarioId: string): Promise<number> {
    return this.notificacionRepositorio.contarNoLeidas(usuarioId);
  }

  marcarLeida(id: string, usuarioId: string): Promise<void> {
    return this.notificacionRepositorio.marcarLeida(id, usuarioId);
  }

  marcarTodasLeidas(usuarioId: string): Promise<void> {
    return this.notificacionRepositorio.marcarTodasLeidas(usuarioId);
  }
}
