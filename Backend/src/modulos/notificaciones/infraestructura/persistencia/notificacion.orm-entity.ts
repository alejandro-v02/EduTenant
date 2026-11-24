import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { TipoNotificacion } from '../../../../compartido/tipos/tipo-notificacion.enum';

@Entity('notificaciones')
export class NotificacionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'institucion_id', type: 'uuid' })
  institucionId: string;

  @Index()
  @Column({ name: 'usuario_id', type: 'uuid' })
  usuarioId: string;

  @Column({ type: 'enum', enum: TipoNotificacion })
  tipo: TipoNotificacion;

  @Column()
  titulo: string;

  @Column()
  mensaje: string;

  @Column({ type: 'varchar', nullable: true })
  enlace: string | null;

  @Column({ default: false })
  leida: boolean;

  @CreateDateColumn({ name: 'creada_en' })
  creadaEn: Date;
}
