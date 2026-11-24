import type { ReactNode } from 'react';

export interface ColumnaTabla<T> {
  encabezado: string;
  render: (fila: T) => ReactNode;
  ancho?: string;
}

interface TablaProps<T> {
  columnas: ColumnaTabla<T>[];
  datos: T[];
  claveFila: (fila: T) => string;
  mensajeVacio?: string;
}

export function Tabla<T>({ columnas, datos, claveFila, mensajeVacio = 'No hay datos para mostrar.' }: TablaProps<T>) {
  if (datos.length === 0) {
    return <p className="tabla-vacia">{mensajeVacio}</p>;
  }

  return (
    <div className="tabla-contenedor">
      <table className="tabla">
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th key={columna.encabezado} style={{ width: columna.ancho }}>
                {columna.encabezado}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datos.map((fila) => (
            <tr key={claveFila(fila)}>
              {columnas.map((columna) => (
                <td key={columna.encabezado}>{columna.render(fila)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
