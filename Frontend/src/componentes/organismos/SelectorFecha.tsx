import { useEffect, useRef, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Calendario } from './Calendario';
import { aISO, analizarISO, formatearFechaLarga, hoyISO } from '../../utilidades/fechas';

interface SelectorFechaProps {
  value: string;
  onChange: (valor: string) => void;
  disabled?: boolean;
}

/**
 * El calendario nativo de `<input type="date">` es una ventana del sistema operativo: no se
 * puede re-estilizar con CSS en ningún navegador. Este componente lo reemplaza por completo con
 * un desplegable propio, acorde al resto de la interfaz.
 */
export function SelectorFecha({ value, onChange, disabled = false }: SelectorFechaProps) {
  const [abierto, setAbierto] = useState(false);
  const seleccionada = analizarISO(value);
  const hoy = analizarISO(hoyISO())!;
  const [vista, setVista] = useState({ anio: seleccionada?.anio ?? hoy.anio, mes: seleccionada?.mes ?? hoy.mes });
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function alHacerClicFuera(evento: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target as Node)) {
        setAbierto(false);
      }
    }
    function alPresionarTecla(evento: KeyboardEvent) {
      if (evento.key === 'Escape') setAbierto(false);
    }
    document.addEventListener('mousedown', alHacerClicFuera);
    document.addEventListener('keydown', alPresionarTecla);
    return () => {
      document.removeEventListener('mousedown', alHacerClicFuera);
      document.removeEventListener('keydown', alPresionarTecla);
    };
  }, []);

  function abrir() {
    if (disabled) return;
    setVista({ anio: seleccionada?.anio ?? hoy.anio, mes: seleccionada?.mes ?? hoy.mes });
    setAbierto((valor) => !valor);
  }

  function elegirHoy() {
    onChange(hoyISO());
    setAbierto(false);
  }

  return (
    <div className={`selector-fecha ${disabled ? 'selector-fecha--deshabilitado' : ''}`} ref={contenedorRef}>
      <button
        type="button"
        className="campo-entrada selector-fecha__disparador"
        onClick={abrir}
        disabled={disabled}
      >
        <CalendarDays size={15} />
        <span className={value ? '' : 'selector-fecha__placeholder'}>
          {value ? formatearFechaLarga(value) : 'Seleccionar fecha'}
        </span>
      </button>

      {abierto && (
        <div className="selector-fecha__panel">
          <Calendario
            anio={vista.anio}
            mes={vista.mes}
            onCambiarMes={(anio, mes) => setVista({ anio, mes })}
            renderDia={(dia, { esHoy }) => {
              const iso = aISO(vista.anio, vista.mes, dia);
              const estaSeleccionado =
                seleccionada?.anio === vista.anio && seleccionada.mes === vista.mes && seleccionada.dia === dia;
              return (
                <button
                  type="button"
                  className={`selector-fecha__dia ${estaSeleccionado ? 'seleccionado' : ''} ${esHoy ? 'hoy' : ''}`}
                  onClick={() => {
                    onChange(iso);
                    setAbierto(false);
                  }}
                >
                  {dia}
                </button>
              );
            }}
          />
          <button type="button" className="selector-fecha__hoy" onClick={elegirHoy}>
            Hoy
          </button>
        </div>
      )}
    </div>
  );
}
