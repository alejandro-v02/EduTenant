import type { ReactNode } from 'react';

interface TarjetaProps {
  titulo?: string;
  acciones?: ReactNode;
  children: ReactNode;
}

export function Tarjeta({ titulo, acciones, children }: TarjetaProps) {
  return (
    <section className="tarjeta">
      {(titulo || acciones) && (
        <header className="tarjeta__cabecera">
          {titulo && <h2>{titulo}</h2>}
          {acciones}
        </header>
      )}
      <div className="tarjeta__contenido">{children}</div>
    </section>
  );
}
