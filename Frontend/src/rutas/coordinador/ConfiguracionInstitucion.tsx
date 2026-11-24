import { useState } from 'react';
import type { FormEvent } from 'react';
import { Building2, Mail, MapPin, Phone } from 'lucide-react';
import { Boton } from '../../componentes/atomos/Boton';
import { Input } from '../../componentes/atomos/Input';
import { CampoFormulario } from '../../componentes/moleculas/CampoFormulario';
import { EstadoCargando } from '../../componentes/moleculas/EstadoCargando';
import { SelectorUbicacion } from '../../componentes/organismos/SelectorUbicacion';
import { Tarjeta } from '../../componentes/organismos/Tarjeta';
import { usePeticion } from '../../hooks/usePeticion';
import { extraerMensajeError } from '../../servicios/clienteApi';
import { actualizarInstitucionActual, obtenerInstitucionActual } from '../../servicios/serviciosInstituciones';
import { notificar } from '../../utilidades/notificaciones';
import type { DatosActualizarInstitucion, Institucion } from '../../tipos/tipos';

function valoresIniciales(institucion: Institucion): DatosActualizarInstitucion {
  return {
    nombre: institucion.nombre,
    direccion: institucion.direccion ?? '',
    telefono: institucion.telefono ?? '',
    email: institucion.email ?? '',
    departamento: institucion.departamento ?? '',
    municipio: institucion.municipio ?? '',
    descripcion: institucion.descripcion ?? '',
  };
}

function Formulario({ institucion }: { institucion: Institucion }) {
  const [valores, setValores] = useState<DatosActualizarInstitucion>(() => valoresIniciales(institucion));
  const [enviando, setEnviando] = useState(false);

  function actualizarCampo<K extends keyof DatosActualizarInstitucion>(campo: K, valor: string) {
    setValores((previo) => ({ ...previo, [campo]: valor }));
  }

  async function manejarEnvio(evento: FormEvent) {
    evento.preventDefault();
    setEnviando(true);
    try {
      await actualizarInstitucionActual(valores);
      notificar('exito', 'Datos de la institución actualizados correctamente.');
    } catch (err) {
      notificar('error', extraerMensajeError(err, 'No se pudo actualizar la institución.'));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={manejarEnvio}>
      <div className="formulario__grilla">
        <CampoFormulario etiqueta="Nombre" icono={Building2}>
          <Input value={valores.nombre} onChange={(e) => actualizarCampo('nombre', e.target.value)} required />
        </CampoFormulario>
        <CampoFormulario etiqueta="Teléfono" icono={Phone}>
          <Input value={valores.telefono} onChange={(e) => actualizarCampo('telefono', e.target.value)} />
        </CampoFormulario>
        <CampoFormulario etiqueta="Email de contacto" icono={Mail}>
          <Input type="email" value={valores.email} onChange={(e) => actualizarCampo('email', e.target.value)} />
        </CampoFormulario>
        <SelectorUbicacion
          departamento={valores.departamento ?? ''}
          municipio={valores.municipio ?? ''}
          onCambiarDepartamento={(valor) => actualizarCampo('departamento', valor)}
          onCambiarMunicipio={(valor) => actualizarCampo('municipio', valor)}
        />
        <CampoFormulario etiqueta="Dirección" icono={MapPin}>
          <Input value={valores.direccion} onChange={(e) => actualizarCampo('direccion', e.target.value)} />
        </CampoFormulario>
        <div className="formulario__grilla--ancho">
          <CampoFormulario etiqueta="Descripción">
            <Input value={valores.descripcion} onChange={(e) => actualizarCampo('descripcion', e.target.value)} />
          </CampoFormulario>
        </div>
      </div>
      <Boton type="submit" cargando={enviando}>
        Guardar cambios
      </Boton>
    </form>
  );
}

export default function ConfiguracionInstitucion() {
  const institucion = usePeticion(obtenerInstitucionActual);

  return (
    <div className="panel">
      <Tarjeta titulo="Configuración de mi institución">
        {institucion.cargando && <EstadoCargando />}
        {institucion.error && <p className="texto-error">{institucion.error}</p>}
        {institucion.datos && <Formulario institucion={institucion.datos} />}
      </Tarjeta>
    </div>
  );
}
