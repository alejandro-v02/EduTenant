import { useState } from 'react';
import type { FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { Boton } from '../../componentes/atomos/Boton';
import { Selector } from '../../componentes/atomos/Selector';
import { Alerta } from '../../componentes/moleculas/Alerta';
import { CampoFormulario } from '../../componentes/moleculas/CampoFormulario';
import { EstadoCargando } from '../../componentes/moleculas/EstadoCargando';
import { Modal } from '../../componentes/organismos/Modal';
import { Tabla } from '../../componentes/organismos/Tabla';
import type { ColumnaTabla } from '../../componentes/organismos/Tabla';
import { Tarjeta } from '../../componentes/organismos/Tarjeta';
import { usePeticion } from '../../hooks/usePeticion';
import { extraerMensajeError } from '../../servicios/clienteApi';
import { listarCursos } from '../../servicios/serviciosCursos';
import { listarMatriculasPorCurso, matricularEstudiante, retirarMatricula } from '../../servicios/serviciosMatriculas';
import { listarEstudiantes } from '../../servicios/serviciosUsuarios';
import { notificar } from '../../utilidades/notificaciones';
import type { Matricula } from '../../tipos/tipos';

export default function GestionMatriculas() {
  const cursos = usePeticion(listarCursos);
  const estudiantes = usePeticion(listarEstudiantes);

  const [cursoId, setCursoId] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [estudianteId, setEstudianteId] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const matriculas = usePeticion(
    () => (cursoId ? listarMatriculasPorCurso(cursoId) : Promise.resolve<Matricula[]>([])),
    [cursoId],
  );

  function nombreEstudiante(id: string) {
    return estudiantes.datos?.find((e) => e.id === id)?.nombre ?? id;
  }

  function abrirModal() {
    setEstudianteId('');
    setError(null);
    setModalAbierto(true);
  }

  async function manejarEnvio(evento: FormEvent) {
    evento.preventDefault();
    setError(null);

    if (!cursoId || !estudianteId) {
      setError('Selecciona un curso y un estudiante.');
      return;
    }

    setEnviando(true);
    try {
      await matricularEstudiante(cursoId, estudianteId);
      notificar('exito', 'Estudiante matriculado correctamente.');
      setModalAbierto(false);
      matriculas.recargar();
    } catch (err) {
      setError(extraerMensajeError(err, 'No se pudo matricular al estudiante.'));
    } finally {
      setEnviando(false);
    }
  }

  async function retirar(id: string) {
    if (!confirm('¿Retirar esta matrícula?')) return;
    try {
      await retirarMatricula(id);
      notificar('exito', 'Matrícula retirada correctamente.');
      matriculas.recargar();
    } catch (err) {
      notificar('error', extraerMensajeError(err, 'No se pudo retirar la matrícula.'));
    }
  }

  const columnas: ColumnaTabla<Matricula>[] = [
    { encabezado: 'Estudiante', render: (m) => nombreEstudiante(m.estudianteId) },
    { encabezado: 'Fecha de matrícula', render: (m) => new Date(m.fechaMatricula).toLocaleDateString() },
    {
      encabezado: 'Acciones',
      render: (m) => (
        <button className="enlace-accion enlace-accion--peligro" onClick={() => retirar(m.id)}>
          Retirar
        </button>
      ),
    },
  ];

  return (
    <div className="panel">
      <Tarjeta
        titulo="Matrículas por curso"
        acciones={
          <Boton onClick={abrirModal} disabled={!cursoId}>
            <Plus size={16} />
            Matricular estudiante
          </Boton>
        }
      >
        <CampoFormulario etiqueta="Curso">
          <Selector value={cursoId} onChange={(e) => setCursoId(e.target.value)}>
            <option value="">Selecciona un curso</option>
            {cursos.datos?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </Selector>
        </CampoFormulario>

        {!cursoId ? (
          <p className="estado-vacio">Selecciona un curso para ver y gestionar sus matrículas.</p>
        ) : matriculas.cargando ? (
          <EstadoCargando />
        ) : (
          <Tabla columnas={columnas} datos={matriculas.datos ?? []} claveFila={(m) => m.id} />
        )}
      </Tarjeta>

      {modalAbierto && (
        <Modal titulo="Matricular estudiante" onCerrar={() => setModalAbierto(false)}>
          <form className="formulario" onSubmit={manejarEnvio}>
            {error && <Alerta tipo="error" mensaje={error} />}
            <CampoFormulario etiqueta="Estudiante">
              <Selector value={estudianteId} onChange={(e) => setEstudianteId(e.target.value)} required>
                <option value="">Selecciona un estudiante</option>
                {estudiantes.datos?.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </Selector>
            </CampoFormulario>
            <div className="formulario__acciones">
              <Boton type="button" variante="secundario" onClick={() => setModalAbierto(false)}>
                Cancelar
              </Boton>
              <Boton type="submit" cargando={enviando}>
                Matricular
              </Boton>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
