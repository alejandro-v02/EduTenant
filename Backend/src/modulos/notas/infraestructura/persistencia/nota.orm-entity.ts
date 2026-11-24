import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notas')
@Index(['institucionId', 'cursoId', 'estudianteId'])
export class NotaOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'institucion_id', type: 'uuid' })
  institucionId: string;

  @Column({ name: 'curso_id', type: 'uuid' })
  cursoId: string;

  @Column({ name: 'estudiante_id', type: 'uuid' })
  estudianteId: string;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    transformer: {
      to: (valor: number) => valor,
      from: (valor: string) => parseFloat(valor),
    },
  })
  valor: number;

  @Column()
  descripcion: string;

  @Column({ type: 'date' })
  fecha: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}
