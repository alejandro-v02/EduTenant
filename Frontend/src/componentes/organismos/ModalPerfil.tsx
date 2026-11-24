import { useState } from 'react';
import type { FormEvent } from 'react';
import { Cake, Hash, IdCard, KeyRound, Mail, MapPin, Phone, User } from 'lucide-react';
import { Boton } from '../atomos/Boton';
import { Input } from '../atomos/Input';
import { Selector } from '../atomos/Selector';
import { Alerta } from '../moleculas/Alerta';
import { CampoFormulario } from '../moleculas/CampoFormulario';
import { EstadoCargando } from '../moleculas/EstadoCargando';
import { Modal } from './Modal';
import { SelectorFecha } from './SelectorFecha';
import { SelectorUbicacion } from './SelectorUbicacion';
import { useSesion } from '../../autenticacion/useSesion';
import { usePeticion } from '../../hooks/usePeticion';
import { extraerMensajeError } from '../../servicios/clienteApi';
import { actualizarMiPerfil, cambiarMiClave, obtenerMiPerfil } from '../../servicios/serviciosPerfil';
import { ETIQUETAS_TIPO_DOCUMENTO } from '../../utilidades/formatoUsuario';
import { notificar } from '../../utilidades/notificaciones';
import type { DatosActualizarPerfil, TipoDocumento, Usuario } from '../../tipos/tipos';

const CAMPOS_REQUERIDOS: (keyof DatosActualizarPerfil)[] = [
  'nombre',
  'apellido',
  'numeroDocumento',
  'telefono',
  'direccion',
  'departamento',
  'municipio',
];

function valoresIniciales(datos: Usuario): DatosActualizarPerfil {
  return {
    nombre: datos.nombre,
    apellido: datos.apellido ?? '',
    tipoDocumento: datos.tipoDocumento ?? 'cedula_ciudadania',
    numeroDocumento: datos.numeroDocumento ?? '',
    telefono: datos.telefono ?? '',
    direccion: datos.direccion ?? '',
    departamento: datos.departamento ?? '',
    municipio: datos.municipio ?? '',
    fechaNacimiento: datos.fechaNacimiento?.slice(0, 10) ?? '',
  };
}

interface FormularioPerfilProps {
  datosPerfil: Usuario;
  obligatorio: boolean;
  onCerrar: () => void;
  onGuardado: (nombre: string, apellido: string) => void;
}

function FormularioPerfil({ datosPerfil, obligatorio, onCerrar, onGuardado }: FormularioPerfilProps) {
  const [valores, setValores] = useState<DatosActualizarPerfil>(() => valoresIniciales(datosPerfil));
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function actualizarCampo<K extends keyof DatosActualizarPerfil>(campo: K, valor: string) {
    setValores((previo) => ({ ...previo, [campo]: valor }));
  }

  async function manejarEnvio(evento: FormEvent) {
    evento.preventDefault();
    setError(null);

    const faltante = CAMPOS_REQUERIDOS.find((campo) => !valores[campo] || String(valores[campo]).trim().length < 2);
    if (faltante) {
      setError('Completa nombre, apellidos, documento, teléfono, departamento, municipio y dirección.');
      return;
    }

    setEnviando(true);
    try {
      await actualizarMiPerfil({ ...valores, fechaNacimiento: valores.fechaNacimiento || undefined });
      notificar('exito', 'Perfil guardado correctamente.');
      onGuardado(valores.nombre ?? datosPerfil.nombre, valores.apellido ?? '');
    } catch (err) {
      setError(extraerMensajeError(err, 'No se pudo guardar el perfil.'));
    } finally {
      setEnviando(false);
    }
  }

  const iniciales = `${(valores.nombre ?? '')[0] ?? ''}${(valores.apellido ?? '')[0] ?? ''}`.toUpperCase() || '?';
  const nombreMostrado = [valores.nombre, valores.apellido].filter(Boolean).join(' ') || datosPerfil.nombre;

  return (
    <>
      <div className="modal__perfil-cabecera">
        <span className="modal__perfil-avatar">{iniciales}</span>
        <div className="modal__perfil-info">
          <span className="modal__perfil-nombre">{nombreMostrado}</span>
          <span className="modal__perfil-email">
            <Mail size={13} />
            {datosPerfil.email}
          </span>
        </div>
      </div>

      {obligatorio && (
        <Alerta
          tipo="error"
          mensaje="Antes de continuar necesitamos algunos datos tuyos: documento, teléfono y dirección de residencia."
        />
      )}
      {error && <Alerta tipo="error" mensaje={error} />}

      <form className="formulario" onSubmit={manejarEnvio}>
        <div className="formulario__grilla">
          <CampoFormulario etiqueta="Nombres" icono={User}>
            <Input value={valores.nombre} onChange={(e) => actualizarCampo('nombre', e.target.value)} required />
          </CampoFormulario>
          <CampoFormulario etiqueta="Apellidos" icono={User}>
            <Input value={valores.apellido} onChange={(e) => actualizarCampo('apellido', e.target.value)} required />
          </CampoFormulario>
          <CampoFormulario etiqueta="Tipo de documento" icono={IdCard}>
            <Selector
              value={valores.tipoDocumento}
              onChange={(e) => actualizarCampo('tipoDocumento', e.target.value as TipoDocumento)}
            >
              {Object.entries(ETIQUETAS_TIPO_DOCUMENTO).map(([valor, etiqueta]) => (
                <option key={valor} value={valor}>
                  {etiqueta}
                </option>
              ))}
            </Selector>
          </CampoFormulario>
          <CampoFormulario etiqueta="Número de documento" icono={Hash}>
            <Input value={valores.numeroDocumento} onChange={(e) => actualizarCampo('numeroDocumento', e.target.value)} required />
          </CampoFormulario>
          <CampoFormulario etiqueta="Fecha de nacimiento (opcional)" icono={Cake}>
            <SelectorFecha value={valores.fechaNacimiento ?? ''} onChange={(valor) => actualizarCampo('fechaNacimiento', valor)} />
          </CampoFormulario>
          <CampoFormulario etiqueta="Teléfono" icono={Phone}>
            <Input value={valores.telefono} onChange={(e) => actualizarCampo('telefono', e.target.value)} required />
          </CampoFormulario>
          <SelectorUbicacion
            departamento={valores.departamento ?? ''}
            municipio={valores.municipio ?? ''}
            onCambiarDepartamento={(valor) => actualizarCampo('departamento', valor)}
            onCambiarMunicipio={(valor) => actualizarCampo('municipio', valor)}
            requerido
          />
          <div className="formulario__grilla--ancho">
            <CampoFormulario etiqueta="Dirección de residencia" icono={MapPin}>
              <Input value={valores.direccion} onChange={(e) => actualizarCampo('direccion', e.target.value)} required />
            </CampoFormulario>
          </div>
        </div>

        <div className="formulario__acciones">
          {!obligatorio && (
            <Boton type="button" variante="secundario" onClick={onCerrar}>
              Cancelar
            </Boton>
          )}
          <Boton type="submit" cargando={enviando}>
            {obligatorio ? 'Guardar y continuar' : 'Guardar cambios'}
          </Boton>
        </div>
      </form>
    </>
  );
}

const VALORES_CLAVE_INICIALES = { claveActual: '', claveNueva: '', confirmarClave: '' };

/** Colapsado por defecto: así "Mi perfil" abre compacto y sin scroll; sólo crece si el usuario lo pide. */
function SeccionCambiarClave() {
  const [abierto, setAbierto] = useState(false);

  if (!abierto) {
    return (
      <button type="button" className="enlace-accion" onClick={() => setAbierto(true)}>
        <KeyRound size={14} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />
        Cambiar contraseña
      </button>
    );
  }

  return <FormularioCambiarClave />;
}

function FormularioCambiarClave() {
  const [valores, setValores] = useState(VALORES_CLAVE_INICIALES);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function manejarEnvio(evento: FormEvent) {
    evento.preventDefault();
    setError(null);

    if (valores.claveNueva.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (valores.claveNueva !== valores.confirmarClave) {
      setError('La confirmación no coincide con la nueva contraseña.');
      return;
    }

    setEnviando(true);
    try {
      await cambiarMiClave(valores.claveActual, valores.claveNueva);
      notificar('exito', 'Contraseña actualizada correctamente.');
      setValores(VALORES_CLAVE_INICIALES);
    } catch (err) {
      setError(extraerMensajeError(err, 'No se pudo cambiar la contraseña.'));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={manejarEnvio}>
      <h3 className="formulario__subtitulo">
        <KeyRound size={16} />
        Cambiar contraseña
      </h3>
      {error && <Alerta tipo="error" mensaje={error} />}
      <div className="formulario__grilla">
        <CampoFormulario etiqueta="Contraseña actual">
          <Input
            type="password"
            value={valores.claveActual}
            onChange={(e) => setValores((v) => ({ ...v, claveActual: e.target.value }))}
            required
          />
        </CampoFormulario>
        <CampoFormulario etiqueta="Contraseña nueva">
          <Input
            type="password"
            value={valores.claveNueva}
            onChange={(e) => setValores((v) => ({ ...v, claveNueva: e.target.value }))}
            required
          />
        </CampoFormulario>
        <CampoFormulario etiqueta="Confirmar contraseña">
          <Input
            type="password"
            value={valores.confirmarClave}
            onChange={(e) => setValores((v) => ({ ...v, confirmarClave: e.target.value }))}
            required
          />
        </CampoFormulario>
      </div>
      <Boton type="submit" variante="secundario" cargando={enviando}>
        Actualizar contraseña
      </Boton>
    </form>
  );
}

interface ModalPerfilProps {
  obligatorio: boolean;
  onCerrar: () => void;
}

/** El perfil se edita en un modal flotante sobre el módulo actual, no en una página aparte. */
export function ModalPerfil({ obligatorio, onCerrar }: ModalPerfilProps) {
  const { actualizarUsuarioSesion } = useSesion();
  const perfil = usePeticion(obtenerMiPerfil);

  function manejarGuardado(nombre: string, apellido: string) {
    actualizarUsuarioSesion({ nombre, apellido, perfilCompleto: true });
    onCerrar();
  }

  return (
    <Modal
      titulo={obligatorio ? 'Completa tu perfil' : 'Mi perfil'}
      onCerrar={onCerrar}
      bloqueado={obligatorio}
      ancho="grande"
    >
      {perfil.cargando && <EstadoCargando />}
      {perfil.error && <p className="texto-error">{perfil.error}</p>}
      {perfil.datos && (
        <>
          <FormularioPerfil datosPerfil={perfil.datos} obligatorio={obligatorio} onCerrar={onCerrar} onGuardado={manejarGuardado} />
          {!obligatorio && <SeccionCambiarClave />}
        </>
      )}
    </Modal>
  );
}
