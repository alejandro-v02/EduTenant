import { EstadoCargando } from '../../componentes/moleculas/EstadoCargando';
import { Tabla } from '../../componentes/organismos/Tabla';
import type { ColumnaTabla } from '../../componentes/organismos/Tabla';
import { Tarjeta } from '../../componentes/organismos/Tarjeta';
import { usePeticion } from '../../hooks/usePeticion';
import { listarMisNotas } from '../../servicios/serviciosNotas';
import type { Nota } from '../../tipos/tipos';

const columnas: ColumnaTabla<Nota>[] = [
  { encabezado: 'Valor', render: (n) => n.valor },
  { encabezado: 'Descripción', render: (n) => n.descripcion },
  { encabezado: 'Fecha', render: (n) => new Date(n.fecha).toLocaleDateString() },
];

/** El backend ya filtra las notas por el estudiante autenticado: el frontend sólo las muestra. */
export default function MisNotas() {
  const notas = usePeticion(listarMisNotas);

  return (
    <Tarjeta titulo="Mis notas">
      {notas.error && <p className="texto-error">{notas.error}</p>}
      {notas.cargando ? (
        <EstadoCargando />
      ) : (
        <Tabla
          columnas={columnas}
          datos={notas.datos ?? []}
          claveFila={(n) => n.id}
          mensajeVacio="Aún no tienes notas registradas."
        />
      )}
    </Tarjeta>
  );
}
