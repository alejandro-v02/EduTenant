import { useState } from 'react';
import type { FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { Boton } from '../../componentes/atomos/Boton';
import { Input } from '../../componentes/atomos/Input';
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
import { actualizarCurso, crearCurso, eliminarCurso, listarCursos } from '../../servicios/serviciosCursos';
import { listarProfesores } from '../../servicios/serviciosUsuarios';
import { notificar } from '../../utilidades/notificaciones';
import type { Curso } from '../../tipos/tipos';

const VALORES_INICIALES = { nombre: '', descripcion: '', profesorId: '' };

export default function GestionCursos() {
  const cursos = usePeticion(listarCursos);
  const profesores = usePeticion(listarProfesores);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [cursoEditandoId, setCursoEditandoId] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function nombreProfesor(id: string | null) {
    if (!id) return 'Sin asignar';
    return profesores.datos?.find((p) => p.id === id)?.nombre ?? 'Sin asignar';
  }

  function abrirCrear() {
    setCursoEditandoId(null);
    setValores(VALORES_INICIALES);
    setError(null);
    setModalAbierto(true);
  }

  function abrirEdicion(curso: Curso) {
    setCursoEditandoId(curso.id);
    setValores({ nombre: curso.nombre, descripcion: curso.descripcion ?? '', profesorId: curso.profesorId ?? '' });
    setError(null);
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
  }

  async function eliminar(id: string) {
    if (!confirm('¿Eliminar este curso?')) return;
    try {
      await eliminarCurso(id);
      notificar('exito', 'Curso eliminado correctamente.');
      cursos.recargar();
    } catch (err) {
      notificar('error', extraerMensajeError(err, 'No se pudo eliminar el curso.'));
    }
  }

  async function manejarEnvio(evento: FormEvent) {
    evento.preventDefault();
    setError(null);

    if (valores.nombre.trim().length < 2) {
      setError('El nombre del curso debe tener al menos 2 caracteres.');
      return;
    }

    const datos = {
      nombre: valores.nombre,
      descripcion: valores.descripcion || undefined,
      profesorId: valores.profesorId || undefined,
    };

    setEnviando(true);
    try {
      if (cursoEditandoId) {
        await actualizarCurso(cursoEditandoId, datos);
      } else {
        await crearCurso(datos);
      }
      notificar('exito', cursoEditandoId ? 'Curso actualizado correctamente.' : 'Curso creado correctamente.');
      setModalAbierto(false);
      cursos.recargar();
    } catch (err) {
      setError(extraerMensajeError(err, 'No se pudo guardar el curso.'));
    } finally {
      setEnviando(false);
    }
  }

  const columnas: ColumnaTabla<Curso>[] = [
    { encabezado: 'Nombre', render: (c) => c.nombre },
    { encabezado: 'Descripción', render: (c) => c.descripcion ?? '—' },
    { encabezado: 'Profesor', render: (c) => nombreProfesor(c.profesorId) },
    {
      encabezado: 'Acciones',
      render: (c) => (
        <div className="acciones-fila">
          <button className="enlace-accion" onClick={() => abrirEdicion(c)}>
            Editar
          </button>
          <button className="enlace-accion enlace-accion--peligro" onClick={() => eliminar(c.id)}>
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="panel">
      <Tarjeta
        titulo="Cursos de la institución"
        acciones={
          <Boton onClick={abrirCrear}>
            <Plus size={16} />
            Nuevo curso
          </Boton>
        }
      >
        {cursos.cargando ? (
          <EstadoCargando />
        ) : (
          <Tabla columnas={columnas} datos={cursos.datos ?? []} claveFila={(c) => c.id} />
        )}
      </Tarjeta>

      {modalAbierto && (
        <Modal titulo={cursoEditandoId ? 'Editar curso' : 'Nuevo curso'} onCerrar={cerrarModal}>
          <form className="formulario" onSubmit={manejarEnvio}>
            {error && <Alerta tipo="error" mensaje={error} />}
            <CampoFormulario etiqueta="Nombre">
              <Input value={valores.nombre} onChange={(e) => setValores((v) => ({ ...v, nombre: e.target.value }))} required />
            </CampoFormulario>
            <CampoFormulario etiqueta="Descripción">
              <Input
                value={valores.descripcion}
                onChange={(e) => setValores((v) => ({ ...v, descripcion: e.target.value }))}
              />
            </CampoFormulario>
            <CampoFormulario etiqueta="Profesor asignado">
              <Selector
                value={valores.profesorId}
                onChange={(e) => setValores((v) => ({ ...v, profesorId: e.target.value }))}
              >
                <option value="">Sin asignar</option>
                {profesores.datos?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </Selector>
            </CampoFormulario>
            <div className="formulario__acciones">
              <Boton type="button" variante="secundario" onClick={cerrarModal}>
                Cancelar
              </Boton>
              <Boton type="submit" cargando={enviando}>
                {cursoEditandoId ? 'Guardar cambios' : 'Crear curso'}
              </Boton>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
