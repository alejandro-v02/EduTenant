export interface BarraDatos {
  etiqueta: string;
  valor: number;
}

interface GraficoBarrasProps {
  datos: BarraDatos[];
  mensajeVacio?: string;
}

/** Ranking horizontal de una sola medida: una sola serie, un solo color, valor directo en la punta. */
export function GraficoBarras({ datos, mensajeVacio = 'Sin datos suficientes.' }: GraficoBarrasProps) {
  if (datos.length === 0) {
    return <p className="tabla-vacia">{mensajeVacio}</p>;
  }

  const maximo = Math.max(...datos.map((d) => d.valor), 1);

  return (
    <div className="grafico-barras">
      {datos.map((dato) => (
        <div className="grafico-barras__fila" key={dato.etiqueta}>
          <span className="grafico-barras__etiqueta" title={dato.etiqueta}>
            {dato.etiqueta}
          </span>
          <span className="grafico-barras__pista">
            <span
              className="grafico-barras__relleno"
              style={{ width: `${Math.max((dato.valor / maximo) * 100, dato.valor > 0 ? 4 : 0)}%` }}
            />
          </span>
          <span className="grafico-barras__valor">{dato.valor}</span>
        </div>
      ))}
    </div>
  );
}
