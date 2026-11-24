import clienteApi from './clienteApi';
import type { NotificacionApp } from '../tipos/tipos';

export function listarMisNotificaciones(): Promise<NotificacionApp[]> {
  return clienteApi.get<NotificacionApp[]>('/notificaciones').then((r) => r.data);
}

export function contarNotificacionesNoLeidas(): Promise<number> {
  return clienteApi.get<{ cantidad: number }>('/notificaciones/no-leidas').then((r) => r.data.cantidad);
}

export function marcarNotificacionLeida(id: string): Promise<void> {
  return clienteApi.patch(`/notificaciones/${id}/leida`).then(() => undefined);
}

export function marcarTodasLasNotificacionesLeidas(): Promise<void> {
  return clienteApi.patch('/notificaciones/leer-todas').then(() => undefined);
}
