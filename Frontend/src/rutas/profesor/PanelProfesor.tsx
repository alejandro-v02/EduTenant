import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap } from 'lucide-react';
import { EstadoCargando } from '../../componentes/moleculas/EstadoCargando';
import { TarjetaEstadistica } from '../../componentes/moleculas/TarjetaEstadistica';
import { GraficoBarras } from '../../componentes/organismos/GraficoBarras';
import { Tarjeta } from '../../componentes/organismos/Tarjeta';
import { usePeticion } from '../../hooks/usePeticion';
import { listarCursos } from '../../servicios/serviciosCursos';
import { listarMatriculasPorCurso } from '../../servicios/serviciosMatriculas';
import type { Curso } from '../../tipos/tipos';

interface CursoConMatricula extends Curso {
  matriculados: number;
}

async function cargarCursosConMatricula(): Promise<CursoConMatricula[]> {
  const cursos = await listarCursos();
  return Promise.all(cursos.map(async (curso) => ({ ...curso, matriculados: (await listarMatriculasPorCurso(curso.id)).length })));
}

export default function PanelProfesor() {
  const { datos: cursos, cargando, error } = usePeticion(cargarCursosConMatricula);

  const totalCursos = cursos?.length ?? 0;
  const totalEstudiantes = cursos?.reduce((suma, c) => suma + c.matriculados, 0) ?? 0;

  return (
    <div className="panel">
      <div className="grid-estadisticas">
        <TarjetaEstadistica etiqueta="Mis cursos" valor={cargando ? '…' : totalCursos} icono={BookOpen} />
        <TarjetaEstadistica etiqueta="Estudiantes a cargo" valor={cargando ? '…' : totalEstudiantes} icono={GraduationCap} />
      </div>

      {error && <p className="texto-error">{error}</p>}

      <div className="grid-panel">
        <Tarjeta titulo="Mis cursos">
          {cargando && <EstadoCargando />}
          {cursos?.length === 0 && <p className="estado-vacio">Aún no tienes cursos asignados.</p>}

          <div className="grid-tarjetas-curso">
            {cursos?.map((curso) => (
              <div key={curso.id} className="tarjeta-curso">
                <h3>{curso.nombre}</h3>
                <p>{curso.descripcion ?? 'Sin descripción'}</p>
                <div className="tarjeta-curso__enlaces">
                  <Link to={`/profesor/cursos/${curso.id}/asistencia`}>Asistencia</Link>
                  <Link to={`/profesor/cursos/${curso.id}/notas`}>Notas</Link>
                  <Link to={`/profesor/cursos/${curso.id}/material`}>Material</Link>
                </div>
              </div>
            ))}
          </div>
        </Tarjeta>

        <Tarjeta titulo="Estudiantes por curso">
          {cargando ? (
            <EstadoCargando />
          ) : (
            <GraficoBarras
              datos={(cursos ?? []).map((c) => ({ etiqueta: c.nombre, valor: c.matriculados }))}
              mensajeVacio="Aún no hay estudiantes matriculados en tus cursos."
            />
          )}
        </Tarjeta>
      </div>
    </div>
  );
}
