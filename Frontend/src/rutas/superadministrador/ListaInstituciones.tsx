import { Link } from 'react-router-dom';
import { Badge } from '../../componentes/atomos/Badge';
import { Boton } from '../../componentes/atomos/Boton';
import { EstadoCargando } from '../../componentes/moleculas/EstadoCargando';
import { Tabla } from '../../componentes/organismos/Tabla';
import type { ColumnaTabla } from '../../componentes/organismos/Tabla';
import { Tarjeta } from '../../componentes/organismos/Tarjeta';
import { usePeticion } from '../../hooks/usePeticion';
import { listarInstituciones } from '../../servicios/serviciosInstituciones';
import type { Institucion } from '../../tipos/tipos';

const columnas: ColumnaTabla<Institucion>[] = [
  { encabezado: 'Nombre', render: (i) => i.nombre },
  { encabezado: 'Departamento', render: (i) => i.departamento ?? '—' },
  { encabezado: 'Municipio', render: (i) => i.municipio ?? '—' },
  { encabezado: 'Plan', render: (i) => i.plan },
  {
    encabezado: 'Estado',
    render: (i) => <Badge tono={i.activo ? 'exito' : 'neutro'}>{i.activo ? 'Activa' : 'Inactiva'}</Badge>,
  },
  {
    encabezado: 'Acciones',
    render: (i) => (
      <Link to={`/superadministrador/instituciones/${i.id}`} className="enlace-accion">
        Ver información →
      </Link>
    ),
  },
];

export default function ListaInstituciones() {
  const { datos, cargando, error } = usePeticion(listarInstituciones);

  return (
    <Tarjeta
      titulo="Instituciones"
      acciones={
        <Link to="/superadministrador/instituciones/nueva">
          <Boton>Crear institución</Boton>
        </Link>
      }
    >
      {error && <p className="texto-error">{error}</p>}
      {cargando ? (
        <EstadoCargando />
      ) : (
        <Tabla
          columnas={columnas}
          datos={datos ?? []}
          claveFila={(i) => i.id}
          mensajeVacio="Aún no hay instituciones registradas."
        />
      )}
    </Tarjeta>
  );
}
