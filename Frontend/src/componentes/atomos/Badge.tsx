import type { ReactNode } from 'react';

type TonoBadge = 'exito' | 'advertencia' | 'peligro' | 'neutro';

interface BadgeProps {
  tono: TonoBadge;
  children: ReactNode;
}

export function Badge({ tono, children }: BadgeProps) {
  return <span className={`badge badge--${tono}`}>{children}</span>;
}
