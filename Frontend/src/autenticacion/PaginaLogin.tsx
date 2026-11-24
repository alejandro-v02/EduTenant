import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Boton } from '../componentes/atomos/Boton';
import { Input } from '../componentes/atomos/Input';
import { Alerta } from '../componentes/moleculas/Alerta';
import { CampoFormulario } from '../componentes/moleculas/CampoFormulario';
import { extraerMensajeError } from '../servicios/clienteApi';
import { rutaBasePorRol } from './rutasPorRol';
import { useSesion } from './useSesion';

export default function PaginaLogin() {
  const { login, cargando } = useSesion();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function manejarEnvio(evento: FormEvent) {
    evento.preventDefault();
    setError(null);

    if (!email.trim() || !clave) {
      setError('Ingresa tu email y tu contraseña.');
      return;
    }

    try {
      const usuario = await login(email.trim(), clave);
      navigate(rutaBasePorRol(usuario.rol), { replace: true });
    } catch (err) {
      setError(extraerMensajeError(err, 'No pudimos iniciar sesión. Verifica tus credenciales.'));
    }
  }

  return (
    <form className="formulario" onSubmit={manejarEnvio}>
      <p className="subtitulo">Inicia sesión para continuar</p>

      {error && <Alerta tipo="error" mensaje={error} />}

      <CampoFormulario etiqueta="Email">
        <Input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </CampoFormulario>

      <CampoFormulario etiqueta="Contraseña">
        <Input
          type="password"
          name="password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          autoComplete="current-password"
          required
        />
      </CampoFormulario>

      <Boton type="submit" cargando={cargando} ancho="completo">
        Ingresar
      </Boton>

      <Link to="/olvide-clave" className="enlace-accion">
        ¿Olvidaste tu contraseña?
      </Link>
    </form>
  );
}
