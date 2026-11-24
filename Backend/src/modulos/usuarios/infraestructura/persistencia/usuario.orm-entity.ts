import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { RolUsuario } from '../../../../compartido/tipos/rol.enum';
import { TipoDocumento } from '../../../../compartido/tipos/tipo-documento.enum';

@Entity('usuarios')
export class UsuarioOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Nulo únicamente cuando rol = superadministrador.
  @Column({ name: 'institucion_id', type: 'uuid', nullable: true })
  institucionId: string | null;

  @Column()
  nombre: string;

  @Column({ type: 'varchar', nullable: true })
  apellido: string | null;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'enum', enum: RolUsuario })
  rol: RolUsuario;

  @Column({ default: true })
  activo: boolean;

  @Column({ name: 'tipo_documento', type: 'enum', enum: TipoDocumento, nullable: true })
  tipoDocumento: TipoDocumento | null;

  @Index({ unique: true, where: 'numero_documento IS NOT NULL' })
  @Column({ name: 'numero_documento', type: 'varchar', nullable: true })
  numeroDocumento: string | null;

  @Column({ type: 'varchar', nullable: true })
  telefono: string | null;

  @Column({ type: 'varchar', nullable: true })
  direccion: string | null;

  @Column({ type: 'varchar', nullable: true })
  departamento: string | null;

  @Column({ type: 'varchar', nullable: true })
  municipio: string | null;

  @Column({ name: 'fecha_nacimiento', type: 'date', nullable: true })
  fechaNacimiento: string | null;

  @Index({ unique: true, where: 'token_recuperacion IS NOT NULL' })
  @Column({ name: 'token_recuperacion', type: 'varchar', nullable: true })
  tokenRecuperacion: string | null;

  @Column({ name: 'token_recuperacion_expira', type: 'timestamptz', nullable: true })
  tokenRecuperacionExpira: Date | null;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}
