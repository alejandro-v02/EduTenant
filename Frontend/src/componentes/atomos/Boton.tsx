import type { ButtonHTMLAttributes } from 'react';
import { Spinner } from './Spinner';

interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'fantasma';
  ancho?: 'auto' | 'completo';
  cargando?: boolean;
}

export function Boton({
  variante = 'primario',
  ancho = 'auto',
  cargando = false,
  disabled,
  className = '',
  children,
  ...resto
}: BotonProps) {
  return (
    <button
      className={`boton boton--${variante} boton--${ancho} ${className}`.trim()}
      disabled={disabled || cargando}
      aria-busy={cargando}
      {...resto}
    >
      {cargando ? <Spinner /> : children}
    </button>
  );
}
