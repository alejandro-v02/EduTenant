import { useParams } from 'react-router-dom';
import { EstadoCargando } from '../../componentes/moleculas/EstadoCargando';
import { Tabla } from '../../componentes/organismos/Tabla';
import type { ColumnaTabla } from '../../componentes/organismos/Tabla';
import { Tarjeta } from '../../componentes/organismos/Tarjeta';
import { usePeticion } from '../../hooks/usePeticion';
import { listarMaterialesPorCurso } from '../../servicios/serviciosMateriales';
import type { Material } from '../../tipos/tipos';

const columnas: ColumnaTabla<Material>[] = [
  { encabezado: 'Título', render: (m) => m.titulo },
  {
    encabezado: 'Archivo',
    render: (m) => (
      <a href={m.archivoUrl} target="_blank" rel="noreferrer">
        Abrir enlace
      </a>
    ),
  },
  { encabezado: 'Fecha', render: (m) => new Date(m.fecha).toLocaleDateString() },
];

export default function MaterialDelCurso() {
  const { cursoId = '' } = useParams();
  const materiales = usePeticion(() => listarMaterialesPorCurso(cursoId), [cursoId]);

  return (
    <Tarjeta titulo="Material del curso">
      {materiales.error && <p className="texto-error">{materiales.error}</p>}
      {materiales.cargando ? (
        <EstadoCargando />
      ) : (
        <Tabla
          columnas={columnas}
          datos={materiales.datos ?? []}
          claveFila={(m) => m.id}
          mensajeVacio="Aún no hay material publicado."
        />
      )}
    </Tarjeta>
  );
}
