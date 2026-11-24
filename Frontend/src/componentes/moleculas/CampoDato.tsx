interface CampoDatoProps {
  etiqueta: string;
  valor: string | number | null | undefined;
}

export function CampoDato({ etiqueta, valor }: CampoDatoProps) {
  return (
    <div className="campo-dato">
      <span className="campo-dato__etiqueta">{etiqueta}</span>
      <span className="campo-dato__valor">{valor || valor === 0 ? valor : '—'}</span>
    </div>
  );
}
