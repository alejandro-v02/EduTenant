import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, UserCog } from 'lucide-react';
import { Boton } from '../../componentes/atomos/Boton';
import { Input } from '../../componentes/atomos/Input';
import { Selector } from '../../componentes/atomos/Selector';
import { Alerta } from '../../componentes/moleculas/Alerta';
import { CampoFormulario } from '../../componentes/moleculas/CampoFormulario';
import { SelectorFecha } from '../../componentes/organismos/SelectorFecha';
import { SelectorUbicacion } from '../../componentes/organismos/SelectorUbicacion';
import { Tarjeta } from '../../componentes/organismos/Tarjeta';
import { extraerMensajeError } from '../../servicios/clienteApi';
import { crearInstitucion } from '../../servicios/serviciosInstituciones';
import { ETIQUETAS_TIPO_DOCUMENTO } from '../../utilidades/formatoUsuario';
import { notificar } from '../../utilidades/notificaciones';
import type { DatosCrearInstitucion } from '../../tipos/tipos';

const VALORES_INICIALES: DatosCrearInstitucion = {
  nombreInstitucion: '',
  slug: '',
  plan: 'basico',
  direccionInstitucion: '',
  telefonoInstitucion: '',
  emailInstitucion: '',
  departamentoInstitucion: '',
  municipioInstitucion: '',
  descripcionInstitucion: '',
  nombreCoordinador: '',
  apellidoCoordinador: '',
  tipoDocumentoCoordinador: 'cedula_ciudadania',
  numeroDocumentoCoordinador: '',
  telefonoCoordinador: '',
  direccionCoordinador: '',
  departamentoCoordinador: '',
  municipioCoordinador: '',
  fechaNacimientoCoordinador: '',
  emailCoordinador: '',
  claveCoordinador: '',
};

const CAMPOS_REQUERIDOS: (keyof DatosCrearInstitucion)[] = [
  'nombreInstitucion',
  'slug',
  'direccionInstitucion',
  'telefonoInstitucion',
  'emailInstitucion',
  'departamentoInstitucion',
  'municipioInstitucion',
  'nombreCoordinador',
  'apellidoCoordinador',
  'numeroDocumentoCoordinador',
  'telefonoCoordinador',
  'direccionCoordinador',
  'departamentoCoordinador',
  'municipioCoordinador',
  'emailCoordinador',
  'claveCoordinador',
];

export default function CrearInstitucion() {
  const navigate = useNavigate();
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function actualizarCampo<K extends keyof DatosCrearInstitucion>(campo: K, valor: string) {
    setValores((previo) => ({ ...previo, [campo]: valor }));
  }

  function validar(): string | null {
    const faltante = CAMPOS_REQUERIDOS.find((campo) => !valores[campo] || String(valores[campo]).trim().length < 2);
    if (faltante) {
      return 'Completa todos los campos obligatorios de la institución y del coordinador.';
    }
    if (valores.claveCoordinador.length < 8) {
      return 'La contraseña del coordinador debe tener al menos 8 caracteres.';
    }
    return null;
  }

  async function manejarEnvio(evento: FormEvent) {
    evento.preventDefault();
    const mensajeInvalido = validar();
    if (mensajeInvalido) {
      setError(mensajeInvalido);
      return;
    }
    setError(null);

    setEnviando(true);
    try {
      await crearInstitucion({
        ...valores,
        plan: valores.plan || undefined,
        descripcionInstitucion: valores.descripcionInstitucion || undefined,
        fechaNacimientoCoordinador: valores.fechaNacimientoCoordinador || undefined,
      });
      notificar('exito', 'Institución creada correctamente.');
      navigate('/superadministrador/instituciones', { replace: true });
    } catch (err) {
      notificar('error', extraerMensajeError(err, 'No se pudo crear la institución.'));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Tarjeta titulo="Crear institución">
      <form className="formulario" onSubmit={manejarEnvio}>
        {error && <Alerta tipo="error" mensaje={error} />}

        <h3 className="formulario__subtitulo">
          <Building2 size={16} />
          Datos de la institución
        </h3>
        <div className="formulario__grilla">
          <CampoFormulario etiqueta="Nombre de la institución">
            <Input value={valores.nombreInstitucion} onChange={(e) => actualizarCampo('nombreInstitucion', e.target.value)} required />
          </CampoFormulario>
          <CampoFormulario etiqueta="Slug (identificador único)">
            <Input value={valores.slug} onChange={(e) => actualizarCampo('slug', e.target.value)} required />
          </CampoFormulario>
          <CampoFormulario etiqueta="Plan">
            <Selector value={valores.plan} onChange={(e) => actualizarCampo('plan', e.target.value)}>
              <option value="basico">Básico</option>
              <option value="estandar">Estándar</option>
              <option value="premium">Premium</option>
            </Selector>
          </CampoFormulario>
          <CampoFormulario etiqueta="Teléfono">
            <Input value={valores.telefonoInstitucion} onChange={(e) => actualizarCampo('telefonoInstitucion', e.target.value)} required />
          </CampoFormulario>
          <CampoFormulario etiqueta="Email de contacto">
            <Input type="email" value={valores.emailInstitucion} onChange={(e) => actualizarCampo('emailInstitucion', e.target.value)} required />
          </CampoFormulario>
          <SelectorUbicacion
            departamento={valores.departamentoInstitucion}
            municipio={valores.municipioInstitucion}
            onCambiarDepartamento={(valor) => actualizarCampo('departamentoInstitucion', valor)}
            onCambiarMunicipio={(valor) => actualizarCampo('municipioInstitucion', valor)}
            requerido
          />
          <CampoFormulario etiqueta="Dirección">
            <Input value={valores.direccionInstitucion} onChange={(e) => actualizarCampo('direccionInstitucion', e.target.value)} required />
          </CampoFormulario>
          <div className="formulario__grilla--ancho">
            <CampoFormulario etiqueta="Descripción (opcional)">
              <Input
                value={valores.descripcionInstitucion}
                onChange={(e) => actualizarCampo('descripcionInstitucion', e.target.value)}
                placeholder="Breve reseña de la institución"
              />
            </CampoFormulario>
          </div>
        </div>

        <h3 className="formulario__subtitulo">
          <UserCog size={16} />
          Coordinador inicial
        </h3>
        <div className="formulario__grilla">
          <CampoFormulario etiqueta="Nombres">
            <Input value={valores.nombreCoordinador} onChange={(e) => actualizarCampo('nombreCoordinador', e.target.value)} required />
          </CampoFormulario>
          <CampoFormulario etiqueta="Apellidos">
            <Input value={valores.apellidoCoordinador} onChange={(e) => actualizarCampo('apellidoCoordinador', e.target.value)} required />
          </CampoFormulario>
          <CampoFormulario etiqueta="Tipo de documento">
            <Selector
              value={valores.tipoDocumentoCoordinador}
              onChange={(e) => actualizarCampo('tipoDocumentoCoordinador', e.target.value)}
            >
              {Object.entries(ETIQUETAS_TIPO_DOCUMENTO).map(([valor, etiqueta]) => (
                <option key={valor} value={valor}>
                  {etiqueta}
                </option>
              ))}
            </Selector>
          </CampoFormulario>
          <CampoFormulario etiqueta="Número de documento">
            <Input value={valores.numeroDocumentoCoordinador} onChange={(e) => actualizarCampo('numeroDocumentoCoordinador', e.target.value)} required />
          </CampoFormulario>
          <CampoFormulario etiqueta="Fecha de nacimiento (opcional)">
            <SelectorFecha
              value={valores.fechaNacimientoCoordinador ?? ''}
              onChange={(valor) => actualizarCampo('fechaNacimientoCoordinador', valor)}
            />
          </CampoFormulario>
          <CampoFormulario etiqueta="Teléfono">
            <Input value={valores.telefonoCoordinador} onChange={(e) => actualizarCampo('telefonoCoordinador', e.target.value)} required />
          </CampoFormulario>
          <SelectorUbicacion
            departamento={valores.departamentoCoordinador}
            municipio={valores.municipioCoordinador}
            onCambiarDepartamento={(valor) => actualizarCampo('departamentoCoordinador', valor)}
            onCambiarMunicipio={(valor) => actualizarCampo('municipioCoordinador', valor)}
            requerido
          />
          <div className="formulario__grilla--ancho">
            <CampoFormulario etiqueta="Dirección de residencia">
              <Input value={valores.direccionCoordinador} onChange={(e) => actualizarCampo('direccionCoordinador', e.target.value)} required />
            </CampoFormulario>
          </div>
          <CampoFormulario etiqueta="Email">
            <Input type="email" value={valores.emailCoordinador} onChange={(e) => actualizarCampo('emailCoordinador', e.target.value)} required />
          </CampoFormulario>
          <CampoFormulario etiqueta="Contraseña temporal">
            <Input type="password" value={valores.claveCoordinador} onChange={(e) => actualizarCampo('claveCoordinador', e.target.value)} required />
          </CampoFormulario>
        </div>

        <Boton type="submit" cargando={enviando}>
          Crear institución
        </Boton>
      </form>
    </Tarjeta>
  );
}
