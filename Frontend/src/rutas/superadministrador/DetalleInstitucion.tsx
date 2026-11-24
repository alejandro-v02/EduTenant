import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, GraduationCap, Users } from 'lucide-react';
import { Badge } from '../../componentes/atomos/Badge';
import { CampoDato } from '../../componentes/moleculas/CampoDato';
import { EstadoCargando } from '../../componentes/moleculas/EstadoCargando';
import { TarjetaEstadistica } from '../../componentes/moleculas/TarjetaEstadistica';
import { Tabla } from '../../componentes/organismos/Tabla';
import type { ColumnaTabla } from '../../componentes/organismos/Tabla';
import { Tarjeta } from '../../componentes/organismos/Tarjeta';
import { usePeticion } from '../../hooks/usePeticion';
import { obtenerInstitucionPorId } from '../../servicios/serviciosInstituciones';
import { ETIQUETAS_TIPO_DOCUMENTO, nombreCompleto } from '../../utilidades/formatoUsuario';
import type { Usuario } from '../../tipos/tipos';

const columnasCoordinadores: ColumnaTabla<Usuario>[] = [
  { encabezado: 'Nombre', render: (u) => nombreCompleto(u) },
  { encabezado: 'Documento', render: (u) => (u.numeroDocumento ? `${u.tipoDocumento ? ETIQUETAS_TIPO_DOCUMENTO[u.tipoDocumento] : ''} ${u.numeroDocumento}` : '—') },
  { encabezado: 'Email', render: (u) => u.email },
  { encabezado: 'Teléfono', render: (u) => u.telefono ?? '—' },
  { encabezado: 'Municipio', render: (u) => u.municipio ?? '—' },
];

export default function DetalleInstitucion() {
  const { id = '' } = useParams();
  const { datos, cargando, error } = usePeticion(() => obtenerInstitucionPorId(id), [id]);

  if (cargando) {
    return <EstadoCargando />;
  }

  if (error || !datos) {
    return <p className="texto-error">{error ?? 'No se pudo cargar la institución.'}</p>;
  }

  const { institucion, coordinadores, totalProfesores, totalEstudiantes, totalCursos } = datos;

  return (
    <div className="panel">
      <div className="cabecera-detalle">
        <Link to="/superadministrador/instituciones" className="enlace-volver">
          <ArrowLeft size={15} />
          Volver a instituciones
        </Link>
      </div>

      <Tarjeta
        titulo={institucion.nombre}
        acciones={
          <div className="acciones-fila">
            <Badge tono={institucion.activo ? 'exito' : 'neutro'}>{institucion.activo ? 'Activa' : 'Inactiva'}</Badge>
            <Badge tono="neutro">{institucion.plan}</Badge>
          </div>
        }
      >
        <div className="grilla-datos">
          <CampoDato etiqueta="Slug" valor={institucion.slug} />
          <CampoDato etiqueta="Departamento" valor={institucion.departamento} />
          <CampoDato etiqueta="Municipio" valor={institucion.municipio} />
          <CampoDato etiqueta="Teléfono" valor={institucion.telefono} />
          <CampoDato etiqueta="Email de contacto" valor={institucion.email} />
          <CampoDato etiqueta="Dirección" valor={institucion.direccion} />
          <CampoDato
            etiqueta="Creada el"
            valor={institucion.creadoEn ? new Date(institucion.creadoEn).toLocaleDateString() : null}
          />
        </div>
        {institucion.descripcion && (
          <div className="campo-dato">
            <span className="campo-dato__etiqueta">Descripción</span>
            <span className="campo-dato__valor">{institucion.descripcion}</span>
          </div>
        )}
      </Tarjeta>

      <div className="grid-estadisticas">
        <TarjetaEstadistica etiqueta="Coordinadores" valor={coordinadores.length} icono={Users} />
        <TarjetaEstadistica etiqueta="Profesores" valor={totalProfesores} icono={Users} />
        <TarjetaEstadistica etiqueta="Estudiantes" valor={totalEstudiantes} icono={GraduationCap} />
        <TarjetaEstadistica etiqueta="Cursos" valor={totalCursos} icono={BookOpen} />
      </div>

      <Tarjeta titulo="Coordinadores">
        <Tabla
          columnas={columnasCoordinadores}
          datos={coordinadores}
          claveFila={(u) => u.id}
          mensajeVacio="Esta institución aún no tiene coordinadores registrados."
        />
      </Tarjeta>
    </div>
  );
}
