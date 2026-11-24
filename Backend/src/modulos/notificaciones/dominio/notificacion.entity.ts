import { TipoNotificacion } from '../../../compartido/tipos/tipo-notificacion.enum';

/** Entidad de dominio pura: sin decoradores de TypeORM ni de Nest. */
export class Notificacion {
  constructor(
    public readonly id: string,
    public readonly usuarioId: string,
    public readonly tipo: TipoNotificacion,
    public readonly titulo: string,
    public readonly mensaje: string,
    public readonly enlace: string | null,
    public leida: boolean,
    public readonly creadaEn: Date,
  ) {}
}

export interface DatosCrearNotificacion {
  institucionId: string;
  usuarioId: string;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  enlace?: string | null;
}
