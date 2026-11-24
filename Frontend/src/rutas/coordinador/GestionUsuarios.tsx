import { useState } from 'react';
import type { FormEvent } from 'react';
import { KeyRound, Plus } from 'lucide-react';
import { Badge } from '../../componentes/atomos/Badge';
import { Boton } from '../../componentes/atomos/Boton';
import { Input } from '../../componentes/atomos/Input';
import { Alerta } from '../../componentes/moleculas/Alerta';
import { CampoFormulario } from '../../componentes/moleculas/CampoFormulario';
import { EstadoCargando } from '../../componentes/moleculas/EstadoCargando';
import { Modal } from '../../componentes/organismos/Modal';
import { Tabla } from '../../componentes/organismos/Tabla';
import type { ColumnaTabla } from '../../componentes/organismos/Tabla';
import { Tarjeta } from '../../componentes/organismos/Tarjeta';
import { usePeticion } from '../../hooks/usePeticion';
import { extraerMensajeError } from '../../servicios/clienteApi';
import {
  crearEstudiante,
  crearProfesor,
  listarEstudiantes,
  listarProfesores,
  restablecerClave,
} from '../../servicios/serviciosUsuarios';
import type { DatosNuevoUsuario } from '../../servicios/serviciosUsuarios';
import { nombreCompleto, perfilEstaCompleto } from '../../utilidades/formatoUsuario';
import { notificar } from '../../utilidades/notificaciones';
import type { Usuario } from '../../tipos/tipos';

type TipoUsuario = 'profesor' | 'estudiante';

const VALORES_INICIALES: DatosNuevoUsuario = { nombre: '', email: '', clave: '' };

interface ModalNuevoUsuarioProps {
  tipo: TipoUsuario;
  crear: (datos: DatosNuevoUsuario) => Promise<Usuario>;
  onCerrar: () => void;
  onCreado: () => void;
}

function ModalNuevoUsuario({ tipo, crear, onCerrar, onCreado }: ModalNuevoUsuarioProps) {
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function manejarEnvio(evento: FormEvent) {
    evento.preventDefault();
    setError(null);

    if (valores.nombre.trim().length < 2 || valores.clave.length < 8) {
      setError('El nombre requiere al menos 2 caracteres y la clave al menos 8.');
      return;
    }

    setEnviando(true);
    try {
      await crear(valores);
      notificar('exito', tipo === 'profesor' ? 'Profesor creado correctamente.' : 'Estudiante creado correctamente.');
      onCreado();
    } catch (err) {
      setError(extraerMensajeError(err, 'No se pudo crear el usuario.'));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal titulo={tipo === 'profesor' ? 'Nuevo profesor' : 'Nuevo estudiante'} onCerrar={onCerrar}>
      <form className="formulario" onSubmit={manejarEnvio}>
        {error && <Alerta tipo="error" mensaje={error} />}
        <CampoFormulario etiqueta="Nombre">
          <Input value={valores.nombre} onChange={(e) => setValores((v) => ({ ...v, nombre: e.target.value }))} required />
        </CampoFormulario>
        <CampoFormulario etiqueta="Email">
          <Input
            type="email"
            value={valores.email}
            onChange={(e) => setValores((v) => ({ ...v, email: e.target.value }))}
            required
          />
        </CampoFormulario>
        <CampoFormulario etiqueta="Contraseña temporal">
          <Input
            type="password"
            value={valores.clave}
            onChange={(e) => setValores((v) => ({ ...v, clave: e.target.value }))}
            required
          />
        </CampoFormulario>
        <div className="formulario__acciones">
          <Boton type="button" variante="secundario" onClick={onCerrar}>
            Cancelar
          </Boton>
          <Boton type="submit" cargando={enviando}>
            Crear
          </Boton>
        </div>
      </form>
    </Modal>
  );
}

interface ModalRestablecerClaveProps {
  usuario: Usuario;
  onCerrar: () => void;
}

function ModalRestablecerClave({ usuario, onCerrar }: ModalRestablecerClaveProps) {
  const [claveNueva, setClaveNueva] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function manejarEnvio(evento: FormEvent) {
    evento.preventDefault();
    setError(null);

    if (claveNueva.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setEnviando(true);
    try {
      await restablecerClave(usuario.id, claveNueva);
      notificar('exito', `Contraseña de ${nombreCompleto(usuario)} restablecida correctamente.`);
      onCerrar();
    } catch (err) {
      setError(extraerMensajeError(err, 'No se pudo restablecer la contraseña.'));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal titulo={`Restablecer contraseña de ${nombreCompleto(usuario)}`} onCerrar={onCerrar}>
      <form className="formulario" onSubmit={manejarEnvio}>
        {error && <Alerta tipo="error" mensaje={error} />}
        <CampoFormulario etiqueta="Nueva contraseña temporal">
          <Input type="password" value={claveNueva} onChange={(e) => setClaveNueva(e.target.value)} required />
        </CampoFormulario>
        <div className="formulario__acciones">
          <Boton type="button" variante="secundario" onClick={onCerrar}>
            Cancelar
          </Boton>
          <Boton type="submit" cargando={enviando}>
            Restablecer
          </Boton>
        </div>
      </form>
    </Modal>
  );
}

export default function GestionUsuarios() {
  const profesores = usePeticion(listarProfesores);
  const estudiantes = usePeticion(listarEstudiantes);
  const [modalAbierto, setModalAbierto] = useState<TipoUsuario | null>(null);
  const [usuarioParaClave, setUsuarioParaClave] = useState<Usuario | null>(null);

  function cerrarYRecargar(tipo: TipoUsuario) {
    setModalAbierto(null);
    if (tipo === 'profesor') profesores.recargar();
    else estudiantes.recargar();
  }

  const columnas: ColumnaTabla<Usuario>[] = [
    { encabezado: 'Nombre', render: (u) => nombreCompleto(u) },
    { encabezado: 'Email', render: (u) => u.email },
    {
      encabezado: 'Perfil',
      render: (u) =>
        perfilEstaCompleto(u) ? <Badge tono="exito">Completo</Badge> : <Badge tono="advertencia">Pendiente</Badge>,
    },
    {
      encabezado: 'Acciones',
      render: (u) => (
        <button className="enlace-accion" onClick={() => setUsuarioParaClave(u)}>
          <KeyRound size={13} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />
          Restablecer clave
        </button>
      ),
    },
  ];

  return (
    <div className="panel">
      <Tarjeta
        titulo="Profesores"
        acciones={
          <Boton onClick={() => setModalAbierto('profesor')}>
            <Plus size={16} />
            Nuevo profesor
          </Boton>
        }
      >
        {profesores.cargando ? (
          <EstadoCargando />
        ) : (
          <Tabla columnas={columnas} datos={profesores.datos ?? []} claveFila={(u) => u.id} />
        )}
      </Tarjeta>

      <Tarjeta
        titulo="Estudiantes"
        acciones={
          <Boton onClick={() => setModalAbierto('estudiante')}>
            <Plus size={16} />
            Nuevo estudiante
          </Boton>
        }
      >
        {estudiantes.cargando ? (
          <EstadoCargando />
        ) : (
          <Tabla columnas={columnas} datos={estudiantes.datos ?? []} claveFila={(u) => u.id} />
        )}
      </Tarjeta>

      {modalAbierto === 'profesor' && (
        <ModalNuevoUsuario
          tipo="profesor"
          crear={crearProfesor}
          onCerrar={() => setModalAbierto(null)}
          onCreado={() => cerrarYRecargar('profesor')}
        />
      )}
      {modalAbierto === 'estudiante' && (
        <ModalNuevoUsuario
          tipo="estudiante"
          crear={crearEstudiante}
          onCerrar={() => setModalAbierto(null)}
          onCreado={() => cerrarYRecargar('estudiante')}
        />
      )}
      {usuarioParaClave && (
        <ModalRestablecerClave usuario={usuarioParaClave} onCerrar={() => setUsuarioParaClave(null)} />
      )}
    </div>
  );
}
