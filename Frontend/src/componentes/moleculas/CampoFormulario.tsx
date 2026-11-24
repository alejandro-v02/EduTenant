import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface CampoFormularioProps {
  etiqueta: string;
  error?: string;
  icono?: LucideIcon;
  children: ReactNode;
}

export function CampoFormulario({ etiqueta, error, icono: Icono, children }: CampoFormularioProps) {
  return (
    <label className="campo-formulario">
      <span className="campo-formulario__etiqueta">
        {Icono && <Icono size={13} />}
        {etiqueta}
      </span>
      {children}
      {error && <span className="campo-formulario__error">{error}</span>}
    </label>
  );
}
