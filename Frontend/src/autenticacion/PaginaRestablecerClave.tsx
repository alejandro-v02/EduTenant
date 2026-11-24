import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Boton } from '../componentes/atomos/Boton';
import { Input } from '../componentes/atomos/Input';
import { Alerta } from '../componentes/moleculas/Alerta';
import { CampoFormulario } from '../componentes/moleculas/CampoFormulario';
import { extraerMensajeError } from '../servicios/clienteApi';
import { restablecerClaveConToken } from '../servicios/serviciosRecuperacion';
import { notificar } from '../utilidades/notificaciones';

export default function PaginaRestablecerClave() {
  const [parametros] = useSearchParams();
  const token = parametros.get('token') ?? '';
  const navigate = useNavigate();

  const [claveNueva, setClaveNueva] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function manejarEnvio(evento: FormEvent) {
    evento.preventDefault();
    setError(null);

    if (!token) {
      setError('El enlace no es válido. Solicita uno nuevo.');
      return;
    }
    if (claveNueva.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (claveNueva !== confirmarClave) {
      setError('La confirmación no coincide con la nueva contraseña.');
      return;
    }

    setEnviando(true);
    try {
      await restablecerClaveConToken(token, claveNueva);
      notificar('exito', 'Contraseña actualizada. Ya puedes iniciar sesión.');
      navigate('/login', { replace: true });
    } catch (err) {
      setError(extraerMensajeError(err, 'El enlace no es válido o ya expiró.'));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={manejarEnvio}>
      <p className="subtitulo">Elige tu nueva contraseña</p>

      {!token && <Alerta tipo="error" mensaje="Este enlace no es válido. Solicita uno nuevo desde el login." />}
      {error && <Alerta tipo="error" mensaje={error} />}

      <CampoFormulario etiqueta="Contraseña nueva">
        <Input type="password" value={claveNueva} onChange={(e) => setClaveNueva(e.target.value)} required />
      </CampoFormulario>
      <CampoFormulario etiqueta="Confirmar contraseña">
        <Input type="password" value={confirmarClave} onChange={(e) => setConfirmarClave(e.target.value)} required />
      </CampoFormulario>

      <Boton type="submit" cargando={enviando} ancho="completo" disabled={!token}>
        Restablecer contraseña
      </Boton>

      <Link to="/login" className="enlace-accion">
        Volver a iniciar sesión
      </Link>
    </form>
  );
}
