import { Badge } from '../../componentes/atomos/Badge';
import { EstadoCargando } from '../../componentes/moleculas/EstadoCargando';
import { Tabla } from '../../componentes/organismos/Tabla';
import type { ColumnaTabla } from '../../componentes/organismos/Tabla';
import { Tarjeta } from '../../componentes/organismos/Tarjeta';
import { usePeticion } from '../../hooks/usePeticion';
import { listarMiAsistencia } from '../../servicios/serviciosAsistencia';
import type { Asistencia } from '../../tipos/tipos';

const TONO_POR_ESTADO = { presente: 'exito', tarde: 'advertencia', ausente: 'peligro' } as const;

const columnas: ColumnaTabla<Asistencia>[] = [
  { encabezado: 'Fecha', render: (a) => new Date(a.fecha).toLocaleDateString() },
  { encabezado: 'Estado', render: (a) => <Badge tono={TONO_POR_ESTADO[a.estado]}>{a.estado}</Badge> },
];

/** El backend ya filtra la asistencia por el estudiante autenticado: el frontend sólo la muestra. */
export default function MiAsistencia() {
  const asistencia = usePeticion(listarMiAsistencia);

  return (
    <Tarjeta titulo="Mi asistencia">
      {asistencia.error && <p className="texto-error">{asistencia.error}</p>}
      {asistencia.cargando ? (
        <EstadoCargando />
      ) : (
        <Tabla
          columnas={columnas}
          datos={asistencia.datos ?? []}
          claveFila={(a) => a.id}
          mensajeVacio="Aún no hay registros de asistencia."
        />
      )}
    </Tarjeta>
  );
}
