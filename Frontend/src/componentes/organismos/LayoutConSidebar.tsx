import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { Menu } from 'lucide-react';
import { useSesion } from '../../autenticacion/useSesion';
import { BusquedaGeneral } from './BusquedaGeneral';
import { MenuUsuario } from './MenuUsuario';
import { ModalPerfil } from './ModalPerfil';
import { PanelNotificaciones } from './PanelNotificaciones';

export interface EnlaceNav {
  to: string;
  etiqueta: string;
  icono: LucideIcon;
  fin?: boolean;
}

interface LayoutConSidebarProps {
  tituloSeccion: string;
  enlaces: EnlaceNav[];
}

export function LayoutConSidebar({ tituloSeccion, enlaces }: LayoutConSidebarProps) {
  const { usuario } = useSesion();
  const location = useLocation();
  const [perfilAbiertoManualmente, setPerfilAbiertoManualmente] = useState(false);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  const perfilObligatorio = Boolean(usuario && !usuario.perfilCompleto);
  const mostrarModalPerfil = perfilAbiertoManualmente || perfilObligatorio;

  // Cierra el menú móvil ante cualquier cambio de ruta (clic en enlace, atrás/adelante, etc.).
  const rutaActual = location.pathname;
  const [rutaPrevia, setRutaPrevia] = useState(rutaActual);
  if (rutaActual !== rutaPrevia) {
    setRutaPrevia(rutaActual);
    setMenuMovilAbierto(false);
  }

  return (
    <div className="layout">
      <aside className={`barra-lateral ${menuMovilAbierto ? 'barra-lateral--abierta-movil' : ''}`}>
        <div className="barra-lateral__cabecera">
          <div className="barra-lateral__marca">
            <span className="barra-lateral__marca-icono">
              <img src="/img/LogoSkolar.png" alt="" />
            </span>
            <span className="barra-lateral__marca-texto">Skolar</span>
          </div>
        </div>

        <nav className="barra-lateral__nav">
          {enlaces.map((enlace) => (
            <NavLink
              key={enlace.to}
              to={enlace.to}
              end={enlace.fin}
              data-tooltip={enlace.etiqueta}
              className={({ isActive }) => `barra-lateral__enlace ${isActive ? 'activo' : ''}`}
            >
              <enlace.icono size={18} />
              <span>{enlace.etiqueta}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {menuMovilAbierto && (
        <div
          className="barra-lateral__fondo-movil"
          onClick={() => setMenuMovilAbierto(false)}
          aria-hidden="true"
        />
      )}

      <div className="layout__principal">
        <header className="barra-superior">
          <button
            type="button"
            className="barra-superior__menu-movil"
            onClick={() => setMenuMovilAbierto(true)}
            aria-label="Abrir menú de navegación"
          >
            <Menu size={19} />
          </button>
          <h1>{tituloSeccion}</h1>
          <BusquedaGeneral />
          <div className="barra-superior__acciones">
            <PanelNotificaciones />
            <MenuUsuario onAbrirPerfil={() => setPerfilAbiertoManualmente(true)} />
          </div>
        </header>
        <main className="layout__contenido">
          <Outlet />
        </main>
      </div>

      {mostrarModalPerfil && (
        <ModalPerfil obligatorio={perfilObligatorio} onCerrar={() => setPerfilAbiertoManualmente(false)} />
      )}
    </div>
  );
}
