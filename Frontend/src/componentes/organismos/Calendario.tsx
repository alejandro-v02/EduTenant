import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NOMBRES_MES } from '../../utilidades/fechas';

const DIAS_SEMANA = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

interface CalendarioProps {
  anio: number;
  mes: number;
  onCambiarMes: (anio: number, mes: number) => void;
  renderDia: (dia: number, contexto: { esHoy: boolean }) => ReactNode;
  /** Rango del selector de año. Por defecto cubre 100 años atrás (sirve para fechas de nacimiento). */
  rangoAnios?: { desde: number; hasta: number };
}

/** Grilla de mes pura: no sabe de selección ni de datos, sólo dibuja el calendario y navega entre meses/años. */
export function Calendario({ anio, mes, onCambiarMes, renderDia, rangoAnios }: CalendarioProps) {
  const hoy = new Date();
  const anioActual = hoy.getFullYear();
  const { desde, hasta } = rangoAnios ?? { desde: anioActual - 100, hasta: anioActual + 1 };
  const anios = Array.from({ length: hasta - desde + 1 }, (_, i) => desde + i);

  function cambiar(delta: number) {
    let mesSiguiente = mes + delta;
    let anioSiguiente = anio;
    if (mesSiguiente > 12) {
      mesSiguiente = 1;
      anioSiguiente += 1;
    }
    if (mesSiguiente < 1) {
      mesSiguiente = 12;
      anioSiguiente -= 1;
    }
    onCambiarMes(anioSiguiente, mesSiguiente);
  }

  const primerDiaSemana = (new Date(anio, mes - 1, 1).getDay() + 6) % 7;
  const diasEnMes = new Date(anio, mes, 0).getDate();
  const celdas: (number | null)[] = [
    ...Array<null>(primerDiaSemana).fill(null),
    ...Array.from({ length: diasEnMes }, (_, i) => i + 1),
  ];
  while (celdas.length % 7 !== 0) celdas.push(null);

  return (
    <div className="calendario">
      <div className="calendario__cabecera">
        <button type="button" onClick={() => cambiar(-1)} aria-label="Mes anterior">
          <ChevronLeft size={16} />
        </button>

        <div className="calendario__selectores">
          <select value={mes} onChange={(e) => onCambiarMes(anio, Number(e.target.value))} aria-label="Mes">
            {NOMBRES_MES.map((nombre, indice) => (
              <option key={nombre} value={indice + 1}>
                {nombre}
              </option>
            ))}
          </select>
          <select value={anio} onChange={(e) => onCambiarMes(Number(e.target.value), mes)} aria-label="Año">
            {anios.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <button type="button" onClick={() => cambiar(1)} aria-label="Mes siguiente">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="calendario__semana">
        {DIAS_SEMANA.map((dia) => (
          <span key={dia}>{dia}</span>
        ))}
      </div>

      <div className="calendario__grilla">
        {celdas.map((dia, indice) =>
          dia === null ? (
            <span key={indice} />
          ) : (
            <div key={indice} className="calendario__celda">
              {renderDia(dia, {
                esHoy: anio === hoy.getFullYear() && mes === hoy.getMonth() + 1 && dia === hoy.getDate(),
              })}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
