import type { LucideIcon } from 'lucide-react';

interface TarjetaEstadisticaProps {
  etiqueta: string;
  valor: string | number;
  icono: LucideIcon;
  tono?: 'acento' | 'advertencia';
}

export function TarjetaEstadistica({ etiqueta, valor, icono: Icono, tono = 'acento' }: TarjetaEstadisticaProps) {
  return (
    <div className="tarjeta-estadistica">
      <div className="tarjeta-estadistica__cabecera">
        <span className={`tarjeta-estadistica__icono ${tono === 'advertencia' ? 'tarjeta-estadistica__icono--advertencia' : ''}`}>
          <Icono size={18} />
        </span>
      </div>
      <span className="tarjeta-estadistica__valor">{valor}</span>
      <span className="tarjeta-estadistica__etiqueta">{etiqueta}</span>
    </div>
  );
}
