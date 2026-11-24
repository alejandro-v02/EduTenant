import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Boton } from '../componentes/atomos/Boton';
import { Input } from '../componentes/atomos/Input';
import { Alerta } from '../componentes/moleculas/Alerta';
import { CampoFormulario } from '../componentes/moleculas/CampoFormulario';
import { extraerMensajeError } from '../servicios/clienteApi';
import { solicitarRecuperacionClave } from '../servicios/serviciosRecuperacion';

export default function PaginaOlvideClave() {
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function manejarEnvio(evento: FormEvent) {
    evento.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Ingresa tu email.');
      return;
    }

    setEnviando(true);
    try {
      await solicitarRecuperacionClave(email.trim());
      setEnviado(true);
    } catch (err) {
      setError(extraerMensajeError(err, 'No pudimos procesar la solicitud.'));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={manejarEnvio}>
      <p className="subtitulo">Recupera tu contraseña</p>

      {error && <Alerta tipo="error" mensaje={error} />}
      {enviado ? (
        <Alerta
          tipo="exito"
          mensaje="Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada (y spam)."
        />
      ) : (
        <>
          <CampoFormulario etiqueta="Email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </CampoFormulario>

          <Boton type="submit" cargando={enviando} ancho="completo">
            Enviar enlace de recuperación
          </Boton>
        </>
      )}

      <Link to="/login" className="enlace-accion">
        Volver a iniciar sesión
      </Link>
    </form>
  );
}
