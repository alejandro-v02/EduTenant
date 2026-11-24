import { Link } from 'react-router-dom';
import { AlertTriangle, BookOpen, GraduationCap, UserX, Users } from 'lucide-react';
import { EstadoCargando } from '../../componentes/moleculas/EstadoCargando';
import { TarjetaEstadistica } from '../../componentes/moleculas/TarjetaEstadistica';
import { GraficoBarras } from '../../componentes/organismos/GraficoBarras';
import { GraficoDona } from '../../componentes/organismos/GraficoDona';
import { Tarjeta } from '../../componentes/organismos/Tarjeta';
import { usePeticion } from '../../hooks/usePeticion';
import { listarCursos } from '../../servicios/serviciosCursos';
import { listarMatriculasPorCurso } from '../../servicios/serviciosMatriculas';
import { listarEstudiantes, listarProfesores } from '../../servicios/serviciosUsuarios';
import type { Curso } from '../../tipos/tipos';

interface CursoConMatricula extends Curso {
  matriculados: number;
}

interface DatosPanel {
  cursos: CursoConMatricula[];
  totalProfesores: number;
  totalEstudiantes: number;
}

/** Agrega varias llamadas del backend: no hay endpoint de resumen, así que se compone en el cliente. */
async function cargarDatosPanel(): Promise<DatosPanel> {
  const [cursos, profesores, estudiantes] = await Promise.all([listarCursos(), listarProfesores(), listarEstudiantes()]);
  const cursosConMatricula = await Promise.all(
    cursos.map(async (curso) => ({ ...curso, matriculados: (await listarMatriculasPorCurso(curso.id)).length })),
  );
  return { cursos: cursosConMatricula, totalProfesores: profesores.length, totalEstudiantes: estudiantes.length };
}

export default function PanelCoordinador() {
  const panel = usePeticion(cargarDatosPanel);

  const cursos = panel.datos?.cursos ?? [];
  const totalCursos = cursos.length;
  const cursosSinProfesor = cursos.filter((c) => !c.profesorId).length;

  const cursosEnRiesgo = cursos
    .map((curso) => {
      const motivos: string[] = [];
      if (!curso.profesorId) motivos.push('Sin profesor asignado');
      if (curso.matriculados === 0) motivos.push('Sin estudiantes matriculados');
      return { curso, motivos };
    })
    .filter((item) => item.motivos.length > 0);

  const rankingMatricula = [...cursos]
    .sort((a, b) => b.matriculados - a.matriculados)
    .slice(0, 6)
    .map((c) => ({ etiqueta: c.nombre, valor: c.matriculados }));

  return (
    <div className="panel">
      <div className="grid-estadisticas">
        <TarjetaEstadistica etiqueta="Cursos" valor={panel.cargando ? '…' : totalCursos} icono={BookOpen} />
        <TarjetaEstadistica
          etiqueta="Profesores"
          valor={panel.cargando ? '…' : panel.datos?.totalProfesores ?? 0}
          icono={Users}
        />
        <TarjetaEstadistica
          etiqueta="Estudiantes"
          valor={panel.cargando ? '…' : panel.datos?.totalEstudiantes ?? 0}
          icono={GraduationCap}
        />
        <TarjetaEstadistica
          etiqueta="Cursos en riesgo"
          valor={panel.cargando ? '…' : cursosEnRiesgo.length}
          icono={AlertTriangle}
          tono="advertencia"
        />
      </div>

      {panel.error && <p className="texto-error">{panel.error}</p>}

      <div className="grid-panel">
        <Tarjeta titulo="Matrícula por curso">
          {panel.cargando ? (
            <EstadoCargando />
          ) : (
            <GraficoBarras datos={rankingMatricula} mensajeVacio="Aún no hay cursos con matrículas." />
          )}
        </Tarjeta>

        <Tarjeta titulo="Cobertura de profesores">
          {panel.cargando ? (
            <EstadoCargando />
          ) : (
            <GraficoDona
              centroValor={totalCursos}
              centroEtiqueta="cursos"
              segmentos={[
                { etiqueta: 'Con profesor', valor: totalCursos - cursosSinProfesor, color: '#0ca30c' },
                { etiqueta: 'Sin profesor', valor: cursosSinProfesor, color: '#fab219' },
              ]}
            />
          )}
        </Tarjeta>
      </div>

      <Tarjeta titulo="Cursos en riesgo">
        {panel.cargando ? (
          <EstadoCargando />
        ) : cursosEnRiesgo.length === 0 ? (
          <p className="estado-vacio">Todos los cursos tienen profesor asignado y estudiantes matriculados.</p>
        ) : (
          <div className="lista-riesgo">
            {cursosEnRiesgo.map(({ curso, motivos }) => {
              const esSerio = motivos.includes('Sin estudiantes matriculados');
              return (
                <div className="item-riesgo" key={curso.id}>
                  <span className={`item-riesgo__icono item-riesgo__icono--${esSerio ? 'serio' : 'advertencia'}`}>
                    {esSerio ? <UserX size={16} /> : <AlertTriangle size={16} />}
                  </span>
                  <div className="item-riesgo__texto">
                    <span className="item-riesgo__titulo">{curso.nombre}</span>
                    <span className="item-riesgo__motivo">{motivos.join(' · ')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Tarjeta>

      <div className="grid-accesos">
        <Tarjeta titulo="Cursos">
          <p>Crea y administra los cursos de tu institución.</p>
          <Link to="/coordinador/cursos">Gestionar cursos →</Link>
        </Tarjeta>
        <Tarjeta titulo="Usuarios">
          <p>Registra profesores y estudiantes nuevos.</p>
          <Link to="/coordinador/usuarios">Gestionar usuarios →</Link>
        </Tarjeta>
        <Tarjeta titulo="Matrículas">
          <p>Matricula estudiantes en los cursos disponibles.</p>
          <Link to="/coordinador/matriculas">Gestionar matrículas →</Link>
        </Tarjeta>
      </div>
    </div>
  );
}
