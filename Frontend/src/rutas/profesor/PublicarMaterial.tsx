import { useState } from 'react';
import type { FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Boton } from '../../componentes/atomos/Boton';
import { Input } from '../../componentes/atomos/Input';
import { Alerta } from '../../componentes/moleculas/Alerta';
import { CampoFormulario } from '../../componentes/moleculas/CampoFormulario';
import { EstadoCargando } from '../../componentes/moleculas/EstadoCargando';
import { Tabla } from '../../componentes/organismos/Tabla';
import type { ColumnaTabla } from '../../componentes/organismos/Tabla';
import { Tarjeta } from '../../componentes/organismos/Tarjeta';
import { usePeticion } from '../../hooks/usePeticion';
import { extraerMensajeError } from '../../servicios/clienteApi';
import { eliminarMaterial, listarMaterialesPorCurso, publicarMaterial } from '../../servicios/serviciosMateriales';
import { notificar } from '../../utilidades/notificaciones';
import type { Material } from '../../tipos/tipos';

const VALORES_INICIALES = { titulo: '', archivoUrl: '' };

export default function PublicarMaterial() {
  const { cursoId = '' } = useParams();
  const materiales = usePeticion(() => listarMaterialesPorCurso(cursoId), [cursoId]);

  const [valores, setValores] = useState(VALORES_INICIALES);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function manejarEnvio(evento: FormEvent) {
    evento.preventDefault();
    setError(null);

    if (valores.titulo.trim().length < 2 || !valores.archivoUrl.trim()) {
      setError('Ingresa un título de al menos 2 caracteres y una URL válida.');
      return;
    }

    setEnviando(true);
    try {
      await publicarMaterial(cursoId, valores.titulo, valores.archivoUrl);
      notificar('exito', 'Material publicado correctamente.');
      setValores(VALORES_INICIALES);
      materiales.recargar();
    } catch (err) {
      notificar('error', extraerMensajeError(err, 'No se pudo publicar el material.'));
    } finally {
      setEnviando(false);
    }
  }

  async function eliminar(id: string) {
    if (!confirm('¿Eliminar este material?')) return;
    try {
      await eliminarMaterial(cursoId, id);
      notificar('exito', 'Material eliminado correctamente.');
      materiales.recargar();
    } catch (err) {
      notificar('error', extraerMensajeError(err, 'No se pudo eliminar el material.'));
    }
  }

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
    {
      encabezado: 'Acciones',
      render: (m) => (
        <button className="enlace-accion enlace-accion--peligro" onClick={() => eliminar(m.id)}>
          Eliminar
        </button>
      ),
    },
  ];

  return (
    <div className="panel">
      <Tarjeta titulo="Publicar material">
        <form className="formulario formulario--en-linea" onSubmit={manejarEnvio}>
          {error && <Alerta tipo="error" mensaje={error} />}
          <CampoFormulario etiqueta="Título">
            <Input value={valores.titulo} onChange={(e) => setValores((v) => ({ ...v, titulo: e.target.value }))} required />
          </CampoFormulario>
          <CampoFormulario etiqueta="URL del archivo">
            <Input
              type="url"
              value={valores.archivoUrl}
              onChange={(e) => setValores((v) => ({ ...v, archivoUrl: e.target.value }))}
              placeholder="https://…"
              required
            />
          </CampoFormulario>
          <Boton type="submit" cargando={enviando}>
            Publicar
          </Boton>
        </form>
      </Tarjeta>

      <Tarjeta titulo="Material publicado">
        {materiales.cargando ? (
          <EstadoCargando />
        ) : (
          <Tabla columnas={columnas} datos={materiales.datos ?? []} claveFila={(m) => m.id} />
        )}
      </Tarjeta>
    </div>
  );
}
