import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso, DatosCrearCurso } from '../../dominio/curso.entity';
import { CursoRepositorio } from '../../dominio/curso.repositorio';
import { CursoOrmEntity } from './curso.orm-entity';

@Injectable()
export class CursosRepositorioTypeOrm implements CursoRepositorio {
  constructor(
    @InjectRepository(CursoOrmEntity)
    private readonly repositorio: Repository<CursoOrmEntity>,
  ) {}

  async crear(datos: DatosCrearCurso): Promise<Curso> {
    const entidad = this.repositorio.create(datos);
    const guardada = await this.repositorio.save(entidad);
    return this.aDominio(guardada);
  }

  async buscarPorIdEnInstitucion(id: string, institucionId: string): Promise<Curso | null> {
    const encontrada = await this.repositorio.findOne({ where: { id, institucionId } });
    return encontrada ? this.aDominio(encontrada) : null;
  }

  async listarPorInstitucion(institucionId: string): Promise<Curso[]> {
    const encontradas = await this.repositorio.find({ where: { institucionId } });
    return encontradas.map((entidad) => this.aDominio(entidad));
  }

  async listarPorProfesor(institucionId: string, profesorId: string): Promise<Curso[]> {
    const encontradas = await this.repositorio.find({ where: { institucionId, profesorId } });
    return encontradas.map((entidad) => this.aDominio(entidad));
  }

  async actualizar(
    id: string,
    institucionId: string,
    cambios: Partial<Pick<Curso, 'nombre' | 'descripcion' | 'profesorId'>>,
  ): Promise<Curso> {
    const entidad = await this.repositorio.findOne({ where: { id, institucionId } });
    if (!entidad) {
      throw new NotFoundException('Curso no encontrado');
    }
    Object.assign(entidad, cambios);
    const guardada = await this.repositorio.save(entidad);
    return this.aDominio(guardada);
  }

  async eliminar(id: string, institucionId: string): Promise<void> {
    const entidad = await this.repositorio.findOne({ where: { id, institucionId } });
    if (!entidad) {
      throw new NotFoundException('Curso no encontrado');
    }
    await this.repositorio.remove(entidad);
  }

  private aDominio(entidad: CursoOrmEntity): Curso {
    return new Curso(entidad.id, entidad.institucionId, entidad.nombre, entidad.descripcion, entidad.profesorId);
  }
}
