import { Link } from 'react-router-dom';
import { Building2, CheckCircle2, PlusCircle, XCircle } from 'lucide-react';
import { Boton } from '../../componentes/atomos/Boton';
import { EstadoCargando } from '../../componentes/moleculas/EstadoCargando';
import { TarjetaEstadistica } from '../../componentes/moleculas/TarjetaEstadistica';
import { GraficoDona } from '../../componentes/organismos/GraficoDona';
import { Tabla } from '../../componentes/organismos/Tabla';
import type { ColumnaTabla } from '../../componentes/organismos/Tabla';
import { Tarjeta } from '../../componentes/organismos/Tarjeta';
import { usePeticion } from '../../hooks/usePeticion';
import { listarInstituciones } from '../../servicios/serviciosInstituciones';
import type { Institucion } from '../../tipos/tipos';

const COLORES_PLAN: Record<string, string> = {
  basico: '#3987e5',
  estandar: '#d95926',
  premium: '#199e70',
};

const columnasRecientes: ColumnaTabla<Institucion>[] = [
  { encabezado: 'Nombre', render: (i) => i.nombre },
  { encabezado: 'Municipio', render: (i) => i.municipio ?? '—' },
  {
    encabezado: 'Creada el',
    render: (i) => (i.creadoEn ? new Date(i.creadoEn).toLocaleDateString() : '—'),
  },
  {
    encabezado: '',
    render: (i) => (
      <Link to={`/superadministrador/instituciones/${i.id}`} className="enlace-accion">
        Ver →
      </Link>
    ),
  },
];

export default function PanelSuperadministrador() {
  const { datos: instituciones, cargando, error } = usePeticion(listarInstituciones);

  const total = instituciones?.length ?? 0;
  const activas = instituciones?.filter((i) => i.activo).length ?? 0;
  const inactivas = total - activas;

  const porPlan = (instituciones ?? []).reduce<Record<string, number>>((acc, i) => {
    acc[i.plan] = (acc[i.plan] ?? 0) + 1;
    return acc;
  }, {});

  const recientes = [...(instituciones ?? [])]
    .sort((a, b) => new Date(b.creadoEn ?? 0).getTime() - new Date(a.creadoEn ?? 0).getTime())
    .slice(0, 5);

  return (
    <div className="panel">
      <div className="grid-estadisticas">
        <TarjetaEstadistica etiqueta="Instituciones registradas" valor={cargando ? '…' : total} icono={Building2} />
        <TarjetaEstadistica etiqueta="Activas" valor={cargando ? '…' : activas} icono={CheckCircle2} />
        <TarjetaEstadistica etiqueta="Inactivas" valor={cargando ? '…' : inactivas} icono={XCircle} tono="advertencia" />
      </div>

      {error && <p className="texto-error">{error}</p>}

      <div className="grid-panel">
        <Tarjeta
          titulo="Instituciones recientes"
          acciones={
            <Link to="/superadministrador/instituciones/nueva">
              <Boton>
                <PlusCircle size={16} />
                Nueva institución
              </Boton>
            </Link>
          }
        >
          {cargando ? (
            <EstadoCargando />
          ) : (
            <Tabla
              columnas={columnasRecientes}
              datos={recientes}
              claveFila={(i) => i.id}
              mensajeVacio="Aún no hay instituciones registradas."
            />
          )}
        </Tarjeta>

        <Tarjeta titulo="Distribución por plan">
          {cargando ? (
            <EstadoCargando />
          ) : total === 0 ? (
            <p className="estado-vacio">Aún no hay instituciones para mostrar.</p>
          ) : (
            <GraficoDona
              centroValor={total}
              centroEtiqueta="instituciones"
              segmentos={Object.entries(porPlan).map(([plan, cantidad]) => ({
                etiqueta: plan,
                valor: cantidad,
                color: COLORES_PLAN[plan] ?? '#71717a',
              }))}
            />
          )}
        </Tarjeta>
      </div>

      <Tarjeta titulo="Gestión de instituciones">
        <p>
          Crea nuevas instituciones junto con su coordinador inicial y consulta el listado completo de
          instituciones registradas en la plataforma.
        </p>
        <Link to="/superadministrador/instituciones">Ver listado completo →</Link>
      </Tarjeta>
    </div>
  );
}
