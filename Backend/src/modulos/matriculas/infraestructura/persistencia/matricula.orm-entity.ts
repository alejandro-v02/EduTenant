import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('matriculas')
@Index(['institucionId', 'cursoId', 'estudianteId'], { unique: true })
export class MatriculaOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'institucion_id', type: 'uuid' })
  institucionId: string;

  @Column({ name: 'curso_id', type: 'uuid' })
  cursoId: string;

  @Column({ name: 'estudiante_id', type: 'uuid' })
  estudianteId: string;

  @CreateDateColumn({ name: 'fecha_matricula' })
  fechaMatricula: Date;
}
