interface EstadoCargandoProps {
  etiqueta?: string;
}

export function EstadoCargando({ etiqueta = 'Cargando…' }: EstadoCargandoProps) {
  return (
    <div className="estado-cargando" role="status" aria-live="polite">
      <span className="spinner spinner--grande" />
      <span>{etiqueta}</span>
    </div>
  );
}
