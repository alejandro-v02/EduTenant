import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, UserRound } from 'lucide-react';
import { useSesion } from '../../autenticacion/useSesion';
import { nombreCompleto } from '../../utilidades/formatoUsuario';

interface MenuUsuarioProps {
  onAbrirPerfil: () => void;
}

export function MenuUsuario({ onAbrirPerfil }: MenuUsuarioProps) {
  const { usuario, logout } = useSesion();
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function alHacerClicFuera(evento: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target as Node)) {
        setAbierto(false);
      }
    }
    document.addEventListener('mousedown', alHacerClicFuera);
    return () => document.removeEventListener('mousedown', alHacerClicFuera);
  }, []);

  if (!usuario) return null;

  const iniciales = `${usuario.nombre[0] ?? ''}${usuario.apellido?.[0] ?? ''}`.toUpperCase();

  function manejarCerrarSesion() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="menu-usuario" ref={contenedorRef}>
      <button type="button" className="menu-usuario__disparador" onClick={() => setAbierto((v) => !v)}>
        <span className="menu-usuario__avatar">{iniciales}</span>
        <span className="menu-usuario__nombre">{nombreCompleto(usuario)}</span>
        <ChevronDown size={14} className={`menu-usuario__flecha ${abierto ? 'abierta' : ''}`} />
      </button>

      {abierto && (
        <div className="menu-usuario__panel">
          <button
            type="button"
            className="menu-usuario__item"
            onClick={() => {
              setAbierto(false);
              onAbrirPerfil();
            }}
          >
            <UserRound size={15} />
            Mi perfil
          </button>
          <button type="button" className="menu-usuario__item menu-usuario__item--peligro" onClick={manejarCerrarSesion}>
            <LogOut size={15} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
