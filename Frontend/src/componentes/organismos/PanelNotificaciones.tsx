import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CalendarX, CheckCheck, FileText, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  contarNotificacionesNoLeidas,
  listarMisNotificaciones,
  marcarNotificacionLeida,
  marcarTodasLasNotificacionesLeidas,
} from '../../servicios/serviciosNotificaciones';
import { formatearTiempoRelativo } from '../../utilidades/fechas';
import type { NotificacionApp, TipoNotificacion } from '../../tipos/tipos';

const INTERVALO_SONDEO_MS = 60_000;

const ICONO_POR_TIPO: Record<TipoNotificacion, LucideIcon> = {
  inasistencia: CalendarX,
  nota_baja: TrendingDown,
  material_nuevo: FileText,
};

export function PanelNotificaciones() {
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);
  const [noLeidas, setNoLeidas] = useState(0);
  const [notificaciones, setNotificaciones] = useState<NotificacionApp[] | null>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contarNotificacionesNoLeidas().then(setNoLeidas).catch(() => {});
    const intervalo = setInterval(() => {
      contarNotificacionesNoLeidas().then(setNoLeidas).catch(() => {});
    }, INTERVALO_SONDEO_MS);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    function alHacerClicFuera(evento: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target as Node)) {
        setAbierto(false);
      }
    }
    document.addEventListener('mousedown', alHacerClicFuera);
    return () => document.removeEventListener('mousedown', alHacerClicFuera);
  }, []);

  function alAbrir() {
    const siguiente = !abierto;
    setAbierto(siguiente);
    if (siguiente && notificaciones === null) {
      listarMisNotificaciones().then(setNotificaciones).catch(() => setNotificaciones([]));
    }
  }

  async function alHacerClicEnNotificacion(notificacion: NotificacionApp) {
    if (!notificacion.leida) {
      setNotificaciones((previas) =>
        (previas ?? []).map((n) => (n.id === notificacion.id ? { ...n, leida: true } : n)),
      );
      setNoLeidas((previo) => Math.max(0, previo - 1));
      marcarNotificacionLeida(notificacion.id).catch(() => {});
    }
    setAbierto(false);
    if (notificacion.enlace) {
      navigate(notificacion.enlace);
    }
  }

  async function marcarTodas() {
    setNotificaciones((previas) => (previas ?? []).map((n) => ({ ...n, leida: true })));
    setNoLeidas(0);
    marcarTodasLasNotificacionesLeidas().catch(() => {});
  }

  return (
    <div className="panel-notificaciones" ref={contenedorRef}>
      <button
        type="button"
        className="panel-notificaciones__disparador"
        onClick={alAbrir}
        aria-label="Notificaciones"
      >
        <Bell size={18} />
        {noLeidas > 0 && <span className="panel-notificaciones__insignia">{noLeidas > 9 ? '9+' : noLeidas}</span>}
      </button>

      {abierto && (
        <div className="panel-notificaciones__panel">
          <div className="panel-notificaciones__cabecera">
            <span>Notificaciones</span>
            {noLeidas > 0 && (
              <button type="button" className="panel-notificaciones__marcar-todas" onClick={marcarTodas}>
                <CheckCheck size={13} />
                Marcar todas leídas
              </button>
            )}
          </div>

          <div className="panel-notificaciones__lista">
            {notificaciones === null && <p className="panel-notificaciones__vacio">Cargando…</p>}
            {notificaciones?.length === 0 && <p className="panel-notificaciones__vacio">No tienes notificaciones.</p>}
            {notificaciones?.map((notificacion) => {
              const Icono = ICONO_POR_TIPO[notificacion.tipo] ?? Bell;
              return (
                <button
                  key={notificacion.id}
                  type="button"
                  className={`panel-notificaciones__item ${notificacion.leida ? '' : 'no-leida'}`}
                  onClick={() => alHacerClicEnNotificacion(notificacion)}
                >
                  <span className="panel-notificaciones__item-icono">
                    <Icono size={15} />
                  </span>
                  <span className="panel-notificaciones__item-texto">
                    <span className="panel-notificaciones__item-titulo">{notificacion.titulo}</span>
                    <span className="panel-notificaciones__item-mensaje">{notificacion.mensaje}</span>
                    <span className="panel-notificaciones__item-fecha">{formatearTiempoRelativo(notificacion.creadaEn)}</span>
                  </span>
                  {!notificacion.leida && <span className="panel-notificaciones__punto" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
