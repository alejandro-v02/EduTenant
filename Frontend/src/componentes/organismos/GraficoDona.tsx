export interface SegmentoDona {
  etiqueta: string;
  valor: number;
  color: string;
}

interface GraficoDonaProps {
  segmentos: SegmentoDona[];
  centroValor: number;
  centroEtiqueta: string;
}

const RADIO = 52;
const GROSOR = 16;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;

/** Anillo de estado (ej. cursos con/sin profesor) con leyenda directa: la identidad nunca depende solo del color. */
export function GraficoDona({ segmentos, centroValor, centroEtiqueta }: GraficoDonaProps) {
  const total = segmentos.reduce((suma, s) => suma + s.valor, 0);

  const longitudes = segmentos.map((s) => (total > 0 ? s.valor / total : 0) * CIRCUNFERENCIA);
  const arcos = segmentos.map((segmento, indice) => ({
    ...segmento,
    longitud: longitudes[indice],
    desplazamiento: longitudes.slice(0, indice).reduce((suma, longitud) => suma + longitud, 0),
  }));

  return (
    <div className="grafico-dona">
      <svg width={140} height={140} viewBox="0 0 140 140" role="img" aria-label={`${centroEtiqueta}: ${centroValor}`}>
        <g transform="rotate(-90 70 70)">
          <circle cx={70} cy={70} r={RADIO} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={GROSOR} />
          {arcos.map((arco) => (
            <circle
              key={arco.etiqueta}
              cx={70}
              cy={70}
              r={RADIO}
              fill="none"
              stroke={arco.color}
              strokeWidth={GROSOR}
              strokeDasharray={`${Math.max(arco.longitud - 2, 0)} ${CIRCUNFERENCIA - Math.max(arco.longitud - 2, 0)}`}
              strokeDashoffset={-arco.desplazamiento}
              strokeLinecap="round"
            >
              <title>{`${arco.etiqueta}: ${arco.valor}`}</title>
            </circle>
          ))}
        </g>
        <text x={70} y={66} textAnchor="middle" className="grafico-dona__centro-etiqueta">
          {centroValor}
        </text>
        <text x={70} y={84} textAnchor="middle" className="grafico-dona__centro-sub">
          {centroEtiqueta}
        </text>
      </svg>

      <div className="grafico-dona__leyenda">
        {segmentos.map((segmento) => (
          <div key={segmento.etiqueta} className="grafico-dona__item">
            <span className="grafico-dona__punto" style={{ background: segmento.color }} />
            <span className="grafico-dona__item-etiqueta">{segmento.etiqueta}</span>
            <span className="grafico-dona__item-valor">{segmento.valor}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
