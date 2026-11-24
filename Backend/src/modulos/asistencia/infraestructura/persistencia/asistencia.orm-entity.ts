import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { EstadoAsistencia } from '../../../../compartido/tipos/estado-asistencia.enum';

@Entity('asistencias')
@Index(['institucionId', 'cursoId', 'estudianteId', 'fecha'], { unique: true })
export class AsistenciaOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'institucion_id', type: 'uuid' })
  institucionId: string;

  @Column({ name: 'curso_id', type: 'uuid' })
  cursoId: string;

  @Column({ name: 'estudiante_id', type: 'uuid' })
  estudianteId: string;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'enum', enum: EstadoAsistencia })
  estado: EstadoAsistencia;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}
