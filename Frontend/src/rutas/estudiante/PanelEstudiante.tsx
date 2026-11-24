import { Link } from 'react-router-dom';
import { BookOpen, CalendarCheck, GraduationCap } from 'lucide-react';
import { EstadoCargando } from '../../componentes/moleculas/EstadoCargando';
import { TarjetaEstadistica } from '../../componentes/moleculas/TarjetaEstadistica';
import { GraficoDona } from '../../componentes/organismos/GraficoDona';
import { Tarjeta } from '../../componentes/organismos/Tarjeta';
import { usePeticion } from '../../hooks/usePeticion';
import { listarMiAsistencia } from '../../servicios/serviciosAsistencia';
import { obtenerCurso } from '../../servicios/serviciosCursos';
import { listarMisMatriculas } from '../../servicios/serviciosMatriculas';
import { listarMisNotas } from '../../servicios/serviciosNotas';
import type { Asistencia, Curso, Nota } from '../../tipos/tipos';

interface DatosPanel {
  cursos: Curso[];
  notas: Nota[];
  asistencia: Asistencia[];
}

async function cargarDatosPanel(): Promise<DatosPanel> {
  const [matriculas, notas, asistencia] = await Promise.all([
    listarMisMatriculas(),
    listarMisNotas(),
    listarMiAsistencia(),
  ]);
  const cursos = await Promise.all(matriculas.map((m) => obtenerCurso(m.cursoId)));
  return { cursos, notas, asistencia };
}

export default function PanelEstudiante() {
  const panel = usePeticion(cargarDatosPanel);

  const cursos = panel.datos?.cursos ?? [];
  const notas = panel.datos?.notas ?? [];
  const asistencia = panel.datos?.asistencia ?? [];

  const promedio = notas.length ? (notas.reduce((suma, n) => suma + n.valor, 0) / notas.length).toFixed(1) : '—';

  const conteoEstados = asistencia.reduce<Record<string, number>>((acc, a) => {
    acc[a.estado] = (acc[a.estado] ?? 0) + 1;
    return acc;
  }, {});
  const totalAsistencia = asistencia.length;
  const porcentajePresente = totalAsistencia ? Math.round(((conteoEstados.presente ?? 0) / totalAsistencia) * 100) : null;

  return (
    <div className="panel">
      <div className="grid-estadisticas">
        <TarjetaEstadistica etiqueta="Cursos matriculados" valor={panel.cargando ? '…' : cursos.length} icono={BookOpen} />
        <TarjetaEstadistica etiqueta="Promedio de notas" valor={panel.cargando ? '…' : promedio} icono={GraduationCap} />
        <TarjetaEstadistica
          etiqueta="Asistencia"
          valor={panel.cargando ? '…' : porcentajePresente !== null ? `${porcentajePresente}%` : '—'}
          icono={CalendarCheck}
        />
      </div>

      {panel.error && <p className="texto-error">{panel.error}</p>}

      <div className="grid-panel">
        <Tarjeta titulo="Mis cursos">
          {panel.cargando && <EstadoCargando />}
          {cursos.length === 0 && !panel.cargando && <p className="estado-vacio">Aún no estás matriculado en ningún curso.</p>}

          <div className="grid-tarjetas-curso">
            {cursos.map((curso) => (
              <div key={curso.id} className="tarjeta-curso">
                <h3>{curso.nombre}</h3>
                <p>{curso.descripcion ?? 'Sin descripción'}</p>
                <div className="tarjeta-curso__enlaces">
                  <Link to={`/estudiante/cursos/${curso.id}/material`}>Ver material →</Link>
                </div>
              </div>
            ))}
          </div>
        </Tarjeta>

        <Tarjeta titulo="Mi asistencia">
          {panel.cargando ? (
            <EstadoCargando />
          ) : totalAsistencia === 0 ? (
            <p className="estado-vacio">Aún no hay registros de asistencia.</p>
          ) : (
            <GraficoDona
              centroValor={totalAsistencia}
              centroEtiqueta="registros"
              segmentos={[
                { etiqueta: 'Presente', valor: conteoEstados.presente ?? 0, color: '#0ca30c' },
                { etiqueta: 'Tarde', valor: conteoEstados.tarde ?? 0, color: '#fab219' },
                { etiqueta: 'Ausente', valor: conteoEstados.ausente ?? 0, color: '#e66767' },
              ]}
            />
          )}
        </Tarjeta>
      </div>

      <div className="grid-accesos">
        <Tarjeta titulo="Mis notas">
          <p>Consulta tus calificaciones registradas por tus profesores.</p>
          <Link to="/estudiante/notas">Ver notas →</Link>
        </Tarjeta>
        <Tarjeta titulo="Mi asistencia">
          <p>Revisa tu historial de asistencia completo.</p>
          <Link to="/estudiante/asistencia">Ver asistencia →</Link>
        </Tarjeta>
      </div>
    </div>
  );
}
