import { AlertTriangle, CalendarCheck, GraduationCap, Users } from 'lucide-react';
import { Badge } from '../../componentes/atomos/Badge';
import { EstadoCargando } from '../../componentes/moleculas/EstadoCargando';
import { TarjetaEstadistica } from '../../componentes/moleculas/TarjetaEstadistica';
import { Tabla } from '../../componentes/organismos/Tabla';
import type { ColumnaTabla } from '../../componentes/organismos/Tabla';
import { Tarjeta } from '../../componentes/organismos/Tarjeta';
import { usePeticion } from '../../hooks/usePeticion';
import { listarCursos } from '../../servicios/serviciosCursos';
import { listarAsistenciaPorCurso } from '../../servicios/serviciosAsistencia';
import { listarMatriculasPorCurso } from '../../servicios/serviciosMatriculas';
import { listarNotasPorCurso } from '../../servicios/serviciosNotas';
import { listarEstudiantes } from '../../servicios/serviciosUsuarios';
import { nombreCompleto } from '../../utilidades/formatoUsuario';

interface EstudianteResumen {
  id: string;
  nombre: string;
  cursos: string[];
  promedio: number | null;
  asistenciaPorcentaje: number | null;
}

const UMBRAL_PROMEDIO_RIESGO = 3;
const UMBRAL_ASISTENCIA_RIESGO = 75;

async function cargarRoster(): Promise<EstudianteResumen[]> {
  const [cursos, estudiantesInstitucion] = await Promise.all([listarCursos(), listarEstudiantes()]);

  const porEstudiante = new Map<
    string,
    { cursos: Set<string>; notas: number[]; asistenciaTotal: number; asistenciaPresente: number }
  >();

  await Promise.all(
    cursos.map(async (curso) => {
      const [matriculas, notas, asistencia] = await Promise.all([
        listarMatriculasPorCurso(curso.id),
        listarNotasPorCurso(curso.id),
        listarAsistenciaPorCurso(curso.id),
      ]);

      matriculas.forEach((m) => {
        const entrada = porEstudiante.get(m.estudianteId) ?? {
          cursos: new Set<string>(),
          notas: [],
          asistenciaTotal: 0,
          asistenciaPresente: 0,
        };
        entrada.cursos.add(curso.nombre);
        porEstudiante.set(m.estudianteId, entrada);
      });
      notas.forEach((n) => porEstudiante.get(n.estudianteId)?.notas.push(n.valor));
      asistencia.forEach((a) => {
        const entrada = porEstudiante.get(a.estudianteId);
        if (!entrada) return;
        entrada.asistenciaTotal += 1;
        if (a.estado === 'presente') entrada.asistenciaPresente += 1;
      });
    }),
  );

  return Array.from(porEstudiante.entries()).map(([id, datos]) => ({
    id,
    nombre: estudiantesInstitucion.find((e) => e.id === id)?.nombre ?? id,
    cursos: Array.from(datos.cursos),
    promedio: datos.notas.length ? datos.notas.reduce((s, v) => s + v, 0) / datos.notas.length : null,
    asistenciaPorcentaje: datos.asistenciaTotal
      ? Math.round((datos.asistenciaPresente / datos.asistenciaTotal) * 100)
      : null,
  }));
}

export default function GestionEstudiantes() {
  const roster = usePeticion(cargarRoster);
  const estudiantes = roster.datos ?? [];

  const promediosValidos = estudiantes.map((e) => e.promedio).filter((v): v is number => v !== null);
  const promedioGeneral = promediosValidos.length
    ? (promediosValidos.reduce((s, v) => s + v, 0) / promediosValidos.length).toFixed(1)
    : '—';

  const asistenciasValidas = estudiantes.map((e) => e.asistenciaPorcentaje).filter((v): v is number => v !== null);
  const asistenciaGeneral = asistenciasValidas.length
    ? `${Math.round(asistenciasValidas.reduce((s, v) => s + v, 0) / asistenciasValidas.length)}%`
    : '—';

  const enRiesgo = estudiantes.filter(
    (e) =>
      (e.promedio !== null && e.promedio < UMBRAL_PROMEDIO_RIESGO) ||
      (e.asistenciaPorcentaje !== null && e.asistenciaPorcentaje < UMBRAL_ASISTENCIA_RIESGO),
  );

  const columnas: ColumnaTabla<EstudianteResumen>[] = [
    { encabezado: 'Estudiante', render: (e) => nombreCompleto({ nombre: e.nombre, apellido: null }) },
    { encabezado: 'Cursos', render: (e) => e.cursos.join(', ') },
    { encabezado: 'Promedio', render: (e) => (e.promedio !== null ? e.promedio.toFixed(1) : '—') },
    {
      encabezado: 'Asistencia',
      render: (e) =>
        e.asistenciaPorcentaje === null ? (
          '—'
        ) : (
          <Badge tono={e.asistenciaPorcentaje >= 90 ? 'exito' : e.asistenciaPorcentaje >= UMBRAL_ASISTENCIA_RIESGO ? 'advertencia' : 'peligro'}>
            {e.asistenciaPorcentaje}%
          </Badge>
        ),
    },
  ];

  return (
    <div className="panel">
      <div className="grid-estadisticas">
        <TarjetaEstadistica etiqueta="Estudiantes a cargo" valor={roster.cargando ? '…' : estudiantes.length} icono={Users} />
        <TarjetaEstadistica etiqueta="Promedio general" valor={roster.cargando ? '…' : promedioGeneral} icono={GraduationCap} />
        <TarjetaEstadistica etiqueta="Asistencia general" valor={roster.cargando ? '…' : asistenciaGeneral} icono={CalendarCheck} />
        <TarjetaEstadistica etiqueta="En riesgo" valor={roster.cargando ? '…' : enRiesgo.length} icono={AlertTriangle} tono="advertencia" />
      </div>

      {roster.error && <p className="texto-error">{roster.error}</p>}

      <Tarjeta titulo="Estudiantes en riesgo">
        {roster.cargando ? (
          <EstadoCargando />
        ) : enRiesgo.length === 0 ? (
          <p className="estado-vacio">Ningún estudiante está por debajo del promedio o la asistencia mínima.</p>
        ) : (
          <div className="lista-riesgo">
            {enRiesgo.map((e) => (
              <div className="item-riesgo" key={e.id}>
                <span className="item-riesgo__icono item-riesgo__icono--serio">
                  <AlertTriangle size={16} />
                </span>
                <div className="item-riesgo__texto">
                  <span className="item-riesgo__titulo">{e.nombre}</span>
                  <span className="item-riesgo__motivo">
                    {[
                      e.promedio !== null && e.promedio < UMBRAL_PROMEDIO_RIESGO ? `Promedio ${e.promedio.toFixed(1)}` : null,
                      e.asistenciaPorcentaje !== null && e.asistenciaPorcentaje < UMBRAL_ASISTENCIA_RIESGO
                        ? `Asistencia ${e.asistenciaPorcentaje}%`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Tarjeta>

      <Tarjeta titulo="Todos mis estudiantes">
        {roster.cargando ? (
          <EstadoCargando />
        ) : (
          <Tabla columnas={columnas} datos={estudiantes} claveFila={(e) => e.id} mensajeVacio="Aún no tienes estudiantes matriculados." />
        )}
      </Tarjeta>
    </div>
  );
}
