import { useEffect, useState } from 'react';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import { descartarNotificacion, suscribirseANotificaciones } from '../../utilidades/notificaciones';
import type { Notificacion } from '../../utilidades/notificaciones';

const DURACION_MS = 4000;

export function Notificaciones() {
  const [lista, setLista] = useState<Notificacion[]>([]);

  useEffect(() => suscribirseANotificaciones(setLista), []);

  if (lista.length === 0) return null;

  return (
    <div className="notificaciones" role="region" aria-label="Notificaciones" aria-live="polite">
      {lista.map((notificacion) => (
        <ItemNotificacion key={notificacion.id} notificacion={notificacion} />
      ))}
    </div>
  );
}

function ItemNotificacion({ notificacion }: { notificacion: Notificacion }) {
  useEffect(() => {
    const temporizador = setTimeout(() => descartarNotificacion(notificacion.id), DURACION_MS);
    return () => clearTimeout(temporizador);
  }, [notificacion.id]);

  const Icono = notificacion.tipo === 'exito' ? CheckCircle2 : XCircle;

  return (
    <div className={`notificacion notificacion--${notificacion.tipo}`}>
      <Icono size={18} />
      <span className="notificacion__mensaje">{notificacion.mensaje}</span>
      <button
        type="button"
        className="notificacion__cerrar"
        onClick={() => descartarNotificacion(notificacion.id)}
        aria-label="Cerrar notificación"
      >
        <X size={14} />
      </button>
      <span className="notificacion__barra" style={{ animationDuration: `${DURACION_MS}ms` }} />
    </div>
  );
}
