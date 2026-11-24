import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatosCrearNotificacion, Notificacion } from '../../dominio/notificacion.entity';
import { NotificacionRepositorio } from '../../dominio/notificacion.repositorio';
import { NotificacionOrmEntity } from './notificacion.orm-entity';

@Injectable()
export class NotificacionesRepositorioTypeOrm implements NotificacionRepositorio {
  constructor(
    @InjectRepository(NotificacionOrmEntity)
    private readonly repositorio: Repository<NotificacionOrmEntity>,
  ) {}

  async crear(datos: DatosCrearNotificacion): Promise<Notificacion> {
    const entidad = this.repositorio.create({ ...datos, enlace: datos.enlace ?? null });
    const guardada = await this.repositorio.save(entidad);
    return this.aDominio(guardada);
  }

  async listarPorUsuario(usuarioId: string, limite: number): Promise<Notificacion[]> {
    const encontradas = await this.repositorio.find({
      where: { usuarioId },
      order: { creadaEn: 'DESC' },
      take: limite,
    });
    return encontradas.map((entidad) => this.aDominio(entidad));
  }

  async contarNoLeidas(usuarioId: string): Promise<number> {
    return this.repositorio.count({ where: { usuarioId, leida: false } });
  }

  async marcarLeida(id: string, usuarioId: string): Promise<void> {
    await this.repositorio.update({ id, usuarioId }, { leida: true });
  }

  async marcarTodasLeidas(usuarioId: string): Promise<void> {
    await this.repositorio.update({ usuarioId, leida: false }, { leida: true });
  }

  private aDominio(entidad: NotificacionOrmEntity): Notificacion {
    return new Notificacion(
      entidad.id,
      entidad.usuarioId,
      entidad.tipo,
      entidad.titulo,
      entidad.mensaje,
      entidad.enlace,
      entidad.leida,
      entidad.creadaEn,
    );
  }
}
