import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CursoRepositorio } from '../../cursos/dominio/curso.repositorio';
import { RolUsuario } from '../../../compartido/tipos/rol.enum';
import { TipoDocumento } from '../../../compartido/tipos/tipo-documento.enum';
import { Institucion } from '../../instituciones/dominio/institucion.entity';
import { InstitucionRepositorio } from '../../instituciones/dominio/institucion.repositorio';
import { aUsuarioPublico, UsuarioPublico } from '../../usuarios/dominio/usuario.entity';
import { UsuarioRepositorio } from '../../usuarios/dominio/usuario.repositorio';

interface DatosCrearInstitucionConCoordinador {
  nombreInstitucion: string;
  slug: string;
  plan?: string;
  direccionInstitucion: string;
  telefonoInstitucion: string;
  emailInstitucion: string;
  departamentoInstitucion: string;
  municipioInstitucion: string;
  descripcionInstitucion?: string;
  nombreCoordinador: string;
  apellidoCoordinador: string;
  tipoDocumentoCoordinador: TipoDocumento;
  numeroDocumentoCoordinador: string;
  telefonoCoordinador: string;
  direccionCoordinador: string;
  departamentoCoordinador: string;
  municipioCoordinador: string;
  fechaNacimientoCoordinador?: string;
  emailCoordinador: string;
  claveCoordinador: string;
}

interface ResultadoCrearInstitucion {
  institucion: Institucion;
  coordinador: UsuarioPublico;
}

interface ResumenInstitucion {
  institucion: Institucion;
  coordinadores: UsuarioPublico[];
  totalProfesores: number;
  totalEstudiantes: number;
  totalCursos: number;
}

/** Único módulo autorizado a crear instituciones y a operar fuera de un tenant. */
@Injectable()
export class SuperadministradorService {
  constructor(
    private readonly institucionRepositorio: InstitucionRepositorio,
    private readonly usuarioRepositorio: UsuarioRepositorio,
    private readonly cursoRepositorio: CursoRepositorio,
  ) {}

  async crearInstitucionConCoordinador(
    datos: DatosCrearInstitucionConCoordinador,
  ): Promise<ResultadoCrearInstitucion> {
    const slugExistente = await this.institucionRepositorio.buscarPorSlug(datos.slug);
    if (slugExistente) {
      throw new ConflictException('Ya existe una institución con ese slug');
    }

    const emailExistente = await this.usuarioRepositorio.buscarPorEmail(datos.emailCoordinador);
    if (emailExistente) {
      throw new ConflictException('Ya existe un usuario registrado con ese email');
    }

    const institucion = await this.institucionRepositorio.crear({
      nombre: datos.nombreInstitucion,
      slug: datos.slug,
      plan: datos.plan ?? 'basico',
      direccion: datos.direccionInstitucion,
      telefono: datos.telefonoInstitucion,
      email: datos.emailInstitucion,
      departamento: datos.departamentoInstitucion,
      municipio: datos.municipioInstitucion,
      descripcion: datos.descripcionInstitucion ?? null,
    });

    const passwordHash = await bcrypt.hash(datos.claveCoordinador, 10);

    const coordinador = await this.usuarioRepositorio.crear({
      institucionId: institucion.id,
      nombre: datos.nombreCoordinador,
      apellido: datos.apellidoCoordinador,
      email: datos.emailCoordinador,
      passwordHash,
      rol: RolUsuario.COORDINADOR,
      tipoDocumento: datos.tipoDocumentoCoordinador,
      numeroDocumento: datos.numeroDocumentoCoordinador,
      telefono: datos.telefonoCoordinador,
      direccion: datos.direccionCoordinador,
      departamento: datos.departamentoCoordinador,
      municipio: datos.municipioCoordinador,
      fechaNacimiento: datos.fechaNacimientoCoordinador ? new Date(datos.fechaNacimientoCoordinador) : null,
    });

    return { institucion, coordinador: aUsuarioPublico(coordinador) };
  }

  listarInstituciones(): Promise<Institucion[]> {
    return this.institucionRepositorio.listarTodas();
  }

  async obtenerInstitucion(id: string): Promise<ResumenInstitucion> {
    const institucion = await this.institucionRepositorio.buscarPorId(id);
    if (!institucion) {
      throw new NotFoundException('Institución no encontrada');
    }

    const [coordinadores, profesores, estudiantes, cursos] = await Promise.all([
      this.usuarioRepositorio.listarPorInstitucionYRol(id, RolUsuario.COORDINADOR),
      this.usuarioRepositorio.listarPorInstitucionYRol(id, RolUsuario.PROFESOR),
      this.usuarioRepositorio.listarPorInstitucionYRol(id, RolUsuario.ESTUDIANTE),
      this.cursoRepositorio.listarPorInstitucion(id),
    ]);

    return {
      institucion,
      coordinadores: coordinadores.map(aUsuarioPublico),
      totalProfesores: profesores.length,
      totalEstudiantes: estudiantes.length,
      totalCursos: cursos.length,
    };
  }
}
