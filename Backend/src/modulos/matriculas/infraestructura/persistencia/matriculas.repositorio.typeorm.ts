import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatosCrearMatricula, Matricula } from '../../dominio/matricula.entity';
import { MatriculaRepositorio } from '../../dominio/matricula.repositorio';
import { MatriculaOrmEntity } from './matricula.orm-entity';

@Injectable()
export class MatriculasRepositorioTypeOrm implements MatriculaRepositorio {
  constructor(
    @InjectRepository(MatriculaOrmEntity)
    private readonly repositorio: Repository<MatriculaOrmEntity>,
  ) {}

  async crear(datos: DatosCrearMatricula): Promise<Matricula> {
    const entidad = this.repositorio.create(datos);
    const guardada = await this.repositorio.save(entidad);
    return this.aDominio(guardada);
  }

  async existe(institucionId: string, cursoId: string, estudianteId: string): Promise<boolean> {
    const cantidad = await this.repositorio.count({ where: { institucionId, cursoId, estudianteId } });
    return cantidad > 0;
  }

  async listarPorCurso(institucionId: string, cursoId: string): Promise<Matricula[]> {
    const encontradas = await this.repositorio.find({ where: { institucionId, cursoId } });
    return encontradas.map((entidad) => this.aDominio(entidad));
  }

  async listarPorEstudiante(institucionId: string, estudianteId: string): Promise<Matricula[]> {
    const encontradas = await this.repositorio.find({ where: { institucionId, estudianteId } });
    return encontradas.map((entidad) => this.aDominio(entidad));
  }

  async eliminar(id: string, institucionId: string): Promise<void> {
    const entidad = await this.repositorio.findOne({ where: { id, institucionId } });
    if (!entidad) {
      throw new NotFoundException('Matrícula no encontrada');
    }
    await this.repositorio.remove(entidad);
  }

  private aDominio(entidad: MatriculaOrmEntity): Matricula {
    return new Matricula(
      entidad.id,
      entidad.institucionId,
      entidad.cursoId,
      entidad.estudianteId,
      entidad.fechaMatricula,
    );
  }
}
