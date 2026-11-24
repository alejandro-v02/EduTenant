import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('materiales')
@Index(['institucionId', 'cursoId'])
export class MaterialOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'institucion_id', type: 'uuid' })
  institucionId: string;

  @Column({ name: 'curso_id', type: 'uuid' })
  cursoId: string;

  @Column()
  titulo: string;

  @Column({ name: 'archivo_url' })
  archivoUrl: string;

  @Column({ name: 'publicado_por', type: 'uuid' })
  publicadoPor: string;

  @CreateDateColumn({ name: 'fecha' })
  fecha: Date;
}
