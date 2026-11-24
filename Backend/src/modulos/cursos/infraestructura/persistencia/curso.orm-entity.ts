import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cursos')
@Index(['institucionId'])
export class CursoOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'institucion_id', type: 'uuid' })
  institucionId: string;

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Column({ name: 'profesor_id', type: 'uuid', nullable: true })
  profesorId: string | null;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}
