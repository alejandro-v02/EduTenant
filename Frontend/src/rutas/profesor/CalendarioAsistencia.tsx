import { useMemo, useState } from 'react';
import { Badge } from '../../componentes/atomos/Badge';
import { Selector } from '../../componentes/atomos/Selector';
import { CampoFormulario } from '../../componentes/moleculas/CampoFormulario';
import { EstadoCargando } from '../../componentes/moleculas/EstadoCargando';
import { Calendario } from '../../componentes/organismos/Calendario';
import { Tabla } from '../../componentes/organismos/Tabla';
import type { ColumnaTabla } from '../../componentes/organismos/Tabla';
import { Tarjeta } from '../../componentes/organismos/Tarjeta';
import { usePeticion } from '../../hooks/usePeticion';
import { listarAsistenciaPorCurso } from '../../servicios/serviciosAsistencia';
import { listarCursos } from '../../servicios/serviciosCursos';
import { listarEstudiantes } from '../../servicios/serviciosUsuarios';
import { aISO, analizarISO, formatearFechaLarga, hoyISO } from '../../utilidades/fechas';
import type { Asistencia } from '../../tipos/tipos';

const TONO_POR_ESTADO = { presente: 'exito', tarde: 'advertencia', ausente: 'peligro' } as const;

export default function CalendarioAsistencia() {
  const cursos = usePeticion(listarCursos);
  const estudiantes = usePeticion(listarEstudiantes);
  const [cursoId, setCursoId] = useState('');
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);
  const hoy = analizarISO(hoyISO())!;
  const [vista, setVista] = useState({ anio: hoy.anio, mes: hoy.mes });

  const registros = usePeticion(
    () => (cursoId ? listarAsistenciaPorCurso(cursoId) : Promise.resolve<Asistencia[]>([])),
    [cursoId],
  );

  const porDia = useMemo(() => {
    const mapa = new Map<string, Asistencia[]>();
    (registros.datos ?? []).forEach((registro) => {
      const fecha = registro.fecha.slice(0, 10);
      const lista = mapa.get(fecha) ?? [];
      lista.push(registro);
      mapa.set(fecha, lista);
    });
    return mapa;
  }, [registros.datos]);

  function nombreEstudiante(id: string) {
    return estudiantes.datos?.find((e) => e.id === id)?.nombre ?? id;
  }

  function seleccionarCurso(valor: string) {
    setCursoId(valor);
    setDiaSeleccionado(null);
  }

  const registrosDelDia = diaSeleccionado ? (porDia.get(diaSeleccionado) ?? []) : [];

  const columnas: ColumnaTabla<Asistencia>[] = [
    { encabezado: 'Estudiante', render: (r) => nombreEstudiante(r.estudianteId) },
    { encabezado: 'Estado', render: (r) => <Badge tono={TONO_POR_ESTADO[r.estado]}>{r.estado}</Badge> },
  ];

  return (
    <div className="panel">
      <Tarjeta titulo="Calendario de asistencia">
        <CampoFormulario etiqueta="Curso">
          <Selector value={cursoId} onChange={(e) => seleccionarCurso(e.target.value)}>
            <option value="">Selecciona un curso</option>
            {cursos.datos?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </Selector>
        </CampoFormulario>

        {!cursoId ? (
          <p className="estado-vacio">Selecciona un curso para ver los días en los que registraste asistencia.</p>
        ) : registros.cargando ? (
          <EstadoCargando />
        ) : (
          <Calendario
            anio={vista.anio}
            mes={vista.mes}
            onCambiarMes={(anio, mes) => {
              setVista({ anio, mes });
              setDiaSeleccionado(null);
            }}
            renderDia={(dia, { esHoy }) => {
              const iso = aISO(vista.anio, vista.mes, dia);
              const registrosDia = porDia.get(iso);
              const tieneAusente = registrosDia?.some((r) => r.estado === 'ausente');
              const tieneTarde = registrosDia?.some((r) => r.estado === 'tarde');
              const tono = registrosDia ? (tieneAusente ? 'peligro' : tieneTarde ? 'advertencia' : 'exito') : null;
              return (
                <button
                  type="button"
                  className={`calendario__dia ${esHoy ? 'hoy' : ''} ${diaSeleccionado === iso ? 'seleccionado' : ''}`}
                  onClick={() => registrosDia && setDiaSeleccionado(iso)}
                  disabled={!registrosDia}
                >
                  {dia}
                  {tono && <span className={`calendario__punto calendario__punto--${tono}`} />}
                </button>
              );
            }}
          />
        )}
      </Tarjeta>

      {diaSeleccionado && (
        <Tarjeta titulo={`Asistencia del ${formatearFechaLarga(diaSeleccionado)}`}>
          <Tabla columnas={columnas} datos={registrosDelDia} claveFila={(r) => r.id} />
        </Tarjeta>
      )}
    </div>
  );
}
