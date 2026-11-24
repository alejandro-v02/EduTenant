import type { SelectHTMLAttributes } from 'react';

export function Selector({ className = '', children, ...resto }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`campo-entrada ${className}`.trim()} {...resto}>
      {children}
    </select>
  );
}
