import { useState } from 'react';
import type { FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Boton } from '../../componentes/atomos/Boton';
import { Input } from '../../componentes/atomos/Input';
import { Selector } from '../../componentes/atomos/Selector';
import { Alerta } from '../../componentes/moleculas/Alerta';
import { CampoFormulario } from '../../componentes/moleculas/CampoFormulario';
import { EstadoCargando } from '../../componentes/moleculas/EstadoCargando';
import { SelectorFecha } from '../../componentes/organismos/SelectorFecha';
import { Tabla } from '../../componentes/organismos/Tabla';
import type { ColumnaTabla } from '../../componentes/organismos/Tabla';
import { Tarjeta } from '../../componentes/organismos/Tarjeta';
import { usePeticion } from '../../hooks/usePeticion';
import { extraerMensajeError } from '../../servicios/clienteApi';
import { listarMatriculasPorCurso } from '../../servicios/serviciosMatriculas';
import { actualizarNota, crearNota, listarNotasPorCurso } from '../../servicios/serviciosNotas';
import { listarEstudiantes } from '../../servicios/serviciosUsuarios';
import { hoyISO } from '../../utilidades/fechas';
import { notificar } from '../../utilidades/notificaciones';
import type { Nota } from '../../tipos/tipos';

const VALORES_INICIALES = { estudianteId: '', valor: '', descripcion: '', fecha: hoyISO() };

export default function RegistrarNotas() {
  const { cursoId = '' } = useParams();
  const matriculas = usePeticion(() => listarMatriculasPorCurso(cursoId), [cursoId]);
  const estudiantes = usePeticion(listarEstudiantes);
  const notas = usePeticion(() => listarNotasPorCurso(cursoId), [cursoId]);

  const [valores, setValores] = useState(VALORES_INICIALES);
  const [notaEditandoId, setNotaEditandoId] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const estudiantesMatriculados = (matriculas.datos ?? [])
    .map((m) => estudiantes.datos?.find((e) => e.id === m.estudianteId))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  function nombreEstudiante(id: string) {
    return estudiantes.datos?.find((e) => e.id === id)?.nombre ?? id;
  }

  function editar(nota: Nota) {
    setNotaEditandoId(nota.id);
    setValores({
      estudianteId: nota.estudianteId,
      valor: String(nota.valor),
      descripcion: nota.descripcion,
      fecha: nota.fecha.slice(0, 10),
    });
  }

  function cancelarEdicion() {
    setNotaEditandoId(null);
    setValores(VALORES_INICIALES);
  }

  async function manejarEnvio(evento: FormEvent) {
    evento.preventDefault();
    setError(null);

    const valorNumerico = Number(valores.valor);
    if (
      !valores.estudianteId ||
      Number.isNaN(valorNumerico) ||
      valorNumerico < 0 ||
      valorNumerico > 10 ||
      valores.descripcion.trim().length < 2
    ) {
      setError('Selecciona un estudiante, una nota entre 0 y 10, y una descripción de al menos 2 caracteres.');
      return;
    }

    setEnviando(true);
    try {
      if (notaEditandoId) {
        await actualizarNota(notaEditandoId, { valor: valorNumerico, descripcion: valores.descripcion });
      } else {
        await crearNota({
          cursoId,
          estudianteId: valores.estudianteId,
          valor: valorNumerico,
          descripcion: valores.descripcion,
          fecha: valores.fecha,
        });
      }
      notificar('exito', notaEditandoId ? 'Nota actualizada correctamente.' : 'Nota registrada correctamente.');
      cancelarEdicion();
      notas.recargar();
    } catch (err) {
      notificar('error', extraerMensajeError(err, 'No se pudo guardar la nota.'));
    } finally {
      setEnviando(false);
    }
  }

  const columnas: ColumnaTabla<Nota>[] = [
    { encabezado: 'Estudiante', render: (n) => nombreEstudiante(n.estudianteId) },
    { encabezado: 'Valor', render: (n) => n.valor },
    { encabezado: 'Descripción', render: (n) => n.descripcion },
    { encabezado: 'Fecha', render: (n) => new Date(n.fecha).toLocaleDateString() },
    {
      encabezado: 'Acciones',
      render: (n) => (
        <button className="enlace-accion" onClick={() => editar(n)}>
          Editar
        </button>
      ),
    },
  ];

  return (
    <div className="panel">
      <Tarjeta titulo={notaEditandoId ? 'Editar nota' : 'Registrar nota'}>
        <form className="formulario formulario--en-linea" onSubmit={manejarEnvio}>
          {error && <Alerta tipo="error" mensaje={error} />}
          <CampoFormulario etiqueta="Estudiante">
            <Selector
              value={valores.estudianteId}
              onChange={(e) => setValores((v) => ({ ...v, estudianteId: e.target.value }))}
              disabled={Boolean(notaEditandoId)}
              required
            >
              <option value="">Selecciona un estudiante</option>
              {estudiantesMatriculados.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </Selector>
          </CampoFormulario>
          <CampoFormulario etiqueta="Valor (0-10)">
            <Input
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={valores.valor}
              onChange={(e) => setValores((v) => ({ ...v, valor: e.target.value }))}
              required
            />
          </CampoFormulario>
          <CampoFormulario etiqueta="Descripción">
            <Input
              value={valores.descripcion}
              onChange={(e) => setValores((v) => ({ ...v, descripcion: e.target.value }))}
              required
            />
          </CampoFormulario>
          <CampoFormulario etiqueta="Fecha">
            <SelectorFecha
              value={valores.fecha}
              onChange={(valor) => setValores((v) => ({ ...v, fecha: valor }))}
              disabled={Boolean(notaEditandoId)}
            />
          </CampoFormulario>
          <div className="formulario__acciones">
            <Boton type="submit" cargando={enviando}>
              {notaEditandoId ? 'Guardar cambios' : 'Registrar nota'}
            </Boton>
            {notaEditandoId && (
              <Boton type="button" variante="secundario" onClick={cancelarEdicion}>
                Cancelar
              </Boton>
            )}
          </div>
        </form>
      </Tarjeta>

      <Tarjeta titulo="Notas registradas">
        {notas.cargando ? <EstadoCargando /> : <Tabla columnas={columnas} datos={notas.datos ?? []} claveFila={(n) => n.id} />}
      </Tarjeta>
    </div>
  );
}
