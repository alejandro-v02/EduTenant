import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolUsuario } from '../../../../compartido/tipos/rol.enum';
import { Usuario } from '../../dominio/usuario.entity';
import { DatosActualizarPerfil, DatosCrearUsuario, UsuarioRepositorio } from '../../dominio/usuario.repositorio';
import { UsuarioOrmEntity } from './usuario.orm-entity';

@Injectable()
export class UsuariosRepositorioTypeOrm implements UsuarioRepositorio {
  constructor(
    @InjectRepository(UsuarioOrmEntity)
    private readonly repositorio: Repository<UsuarioOrmEntity>,
  ) {}

  async crear(datos: DatosCrearUsuario): Promise<Usuario> {
    const entidad = this.repositorio.create({
      ...datos,
      fechaNacimiento: this.aFechaOrm(datos.fechaNacimiento),
    });
    const guardada = await this.repositorio.save(entidad);
    return this.aDominio(guardada);
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const encontrada = await this.repositorio.findOne({ where: { email } });
    return encontrada ? this.aDominio(encontrada) : null;
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    const encontrada = await this.repositorio.findOne({ where: { id } });
    return encontrada ? this.aDominio(encontrada) : null;
  }

  async buscarPorIdEnInstitucion(id: string, institucionId: string): Promise<Usuario | null> {
    const encontrada = await this.repositorio.findOne({ where: { id, institucionId } });
    return encontrada ? this.aDominio(encontrada) : null;
  }

  async listarPorInstitucionYRol(institucionId: string, rol: RolUsuario): Promise<Usuario[]> {
    const encontradas = await this.repositorio.find({ where: { institucionId, rol } });
    return encontradas.map((entidad) => this.aDominio(entidad));
  }

  async actualizarPerfil(id: string, cambios: DatosActualizarPerfil): Promise<Usuario> {
    const entidad = await this.repositorio.findOne({ where: { id } });
    if (!entidad) {
      throw new NotFoundException('Usuario no encontrado');
    }
    Object.assign(entidad, {
      ...cambios,
      fechaNacimiento:
        cambios.fechaNacimiento !== undefined ? this.aFechaOrm(cambios.fechaNacimiento) : entidad.fechaNacimiento,
    });
    const guardada = await this.repositorio.save(entidad);
    return this.aDominio(guardada);
  }

  async actualizarPasswordHash(id: string, passwordHash: string): Promise<void> {
    const resultado = await this.repositorio.update({ id }, { passwordHash });
    if (resultado.affected === 0) {
      throw new NotFoundException('Usuario no encontrado');
    }
  }

  async guardarTokenRecuperacion(usuarioId: string, tokenHash: string, expira: Date): Promise<void> {
    await this.repositorio.update({ id: usuarioId }, { tokenRecuperacion: tokenHash, tokenRecuperacionExpira: expira });
  }

  async buscarPorTokenRecuperacionValido(tokenHash: string): Promise<Usuario | null> {
    const encontrada = await this.repositorio.findOne({ where: { tokenRecuperacion: tokenHash } });
    if (!encontrada || !encontrada.tokenRecuperacionExpira || encontrada.tokenRecuperacionExpira < new Date()) {
      return null;
    }
    return this.aDominio(encontrada);
  }

  async limpiarTokenRecuperacion(usuarioId: string): Promise<void> {
    await this.repositorio.update({ id: usuarioId }, { tokenRecuperacion: null, tokenRecuperacionExpira: null });
  }

  private aFechaOrm(fecha: Date | null | undefined): string | null {
    return fecha ? fecha.toISOString().slice(0, 10) : null;
  }

  private aDominio(entidad: UsuarioOrmEntity): Usuario {
    return new Usuario(
      entidad.id,
      entidad.institucionId,
      entidad.nombre,
      entidad.apellido,
      entidad.email,
      entidad.passwordHash,
      entidad.rol,
      entidad.activo,
      entidad.tipoDocumento,
      entidad.numeroDocumento,
      entidad.telefono,
      entidad.direccion,
      entidad.departamento,
      entidad.municipio,
      entidad.fechaNacimiento ? new Date(entidad.fechaNacimiento) : null,
      entidad.creadoEn,
    );
  }
}
