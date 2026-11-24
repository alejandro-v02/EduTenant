import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Boton } from '../../componentes/atomos/Boton';
import { Selector } from '../../componentes/atomos/Selector';
import { CampoFormulario } from '../../componentes/moleculas/CampoFormulario';
import { EstadoCargando } from '../../componentes/moleculas/EstadoCargando';
import { SelectorFecha } from '../../componentes/organismos/SelectorFecha';
import { Tabla } from '../../componentes/organismos/Tabla';
import type { ColumnaTabla } from '../../componentes/organismos/Tabla';
import { Tarjeta } from '../../componentes/organismos/Tarjeta';
import { usePeticion } from '../../hooks/usePeticion';
import { extraerMensajeError } from '../../servicios/clienteApi';
import { listarAsistenciaPorCurso, registrarAsistencia } from '../../servicios/serviciosAsistencia';
import { listarMatriculasPorCurso } from '../../servicios/serviciosMatriculas';
import { listarEstudiantes } from '../../servicios/serviciosUsuarios';
import { hoyISO } from '../../utilidades/fechas';
import { notificar } from '../../utilidades/notificaciones';
import type { Asistencia, EstadoAsistencia, Usuario } from '../../tipos/tipos';

const OPCIONES_ESTADO: EstadoAsistencia[] = ['presente', 'ausente', 'tarde'];

function estadosDeLaFecha(registros: Asistencia[], fecha: string): Record<string, EstadoAsistencia> {
  const iniciales: Record<string, EstadoAsistencia> = {};
  registros
    .filter((r) => r.fecha.slice(0, 10) === fecha)
    .forEach((r) => {
      iniciales[r.estudianteId] = r.estado;
    });
  return iniciales;
}

interface TablaEstadosProps {
  cursoId: string;
  fecha: string;
  estudiantes: Usuario[];
  registros: Asistencia[];
  alGuardar: () => void;
}

/** Con `key={cursoId-fecha}` en el padre, este componente se remonta al cambiar de fecha:
 * así el estado inicial se calcula una sola vez, sin necesitar un efecto que lo sincronice. */
function TablaEstados({ cursoId, fecha, estudiantes, registros, alGuardar }: TablaEstadosProps) {
  const [estados, setEstados] = useState<Record<string, EstadoAsistencia>>(() => estadosDeLaFecha(registros, fecha));
  const [guardando, setGuardando] = useState(false);

  async function guardarAsistencia() {
    setGuardando(true);
    try {
      await Promise.all(
        estudiantes.map((estudiante) =>
          registrarAsistencia(cursoId, estudiante.id, fecha, estados[estudiante.id] ?? 'presente'),
        ),
      );
      notificar('exito', 'Asistencia guardada correctamente.');
      alGuardar();
    } catch (err) {
      notificar('error', extraerMensajeError(err, 'No se pudo guardar la asistencia.'));
    } finally {
      setGuardando(false);
    }
  }

  const columnas: ColumnaTabla<Usuario>[] = [
    { encabezado: 'Estudiante', render: (e) => e.nombre },
    {
      encabezado: 'Estado',
      render: (e) => (
        <Selector
          value={estados[e.id] ?? 'presente'}
          onChange={(evento) =>
            setEstados((previo) => ({ ...previo, [e.id]: evento.target.value as EstadoAsistencia }))
          }
        >
          {OPCIONES_ESTADO.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </Selector>
      ),
    },
  ];

  return (
    <>
      <Tabla
        columnas={columnas}
        datos={estudiantes}
        claveFila={(e) => e.id}
        mensajeVacio="No hay estudiantes matriculados en este curso."
      />

      <Boton onClick={guardarAsistencia} cargando={guardando}>
        Guardar
      </Boton>
    </>
  );
}

export default function TomarAsistencia() {
  const { cursoId = '' } = useParams();
  const matriculas = usePeticion(() => listarMatriculasPorCurso(cursoId), [cursoId]);
  const estudiantes = usePeticion(listarEstudiantes);
  const registros = usePeticion(() => listarAsistenciaPorCurso(cursoId), [cursoId]);

  const [fecha, setFecha] = useState(hoyISO);

  const estudiantesDelCurso = useMemo<Usuario[]>(() => {
    if (!matriculas.datos || !estudiantes.datos) return [];
    const idsMatriculados = new Set(matriculas.datos.map((m) => m.estudianteId));
    return estudiantes.datos.filter((e) => idsMatriculados.has(e.id));
  }, [matriculas.datos, estudiantes.datos]);

  // Sólo bloquea con "Cargando…" la primera vez: si `registros` ya tiene datos, un
  // recargar() en segundo plano (tras guardar) no debe desmontar la tabla ni su estado.
  const cargando = matriculas.cargando || estudiantes.cargando || (registros.cargando && registros.datos === null);

  return (
    <Tarjeta titulo="Tomar asistencia">
      <CampoFormulario etiqueta="Fecha">
        <SelectorFecha value={fecha} onChange={setFecha} />
      </CampoFormulario>

      {cargando ? (
        <EstadoCargando />
      ) : (
        <TablaEstados
          key={`${cursoId}-${fecha}`}
          cursoId={cursoId}
          fecha={fecha}
          estudiantes={estudiantesDelCurso}
          registros={registros.datos ?? []}
          alGuardar={registros.recargar}
        />
      )}
    </Tarjeta>
  );
}
