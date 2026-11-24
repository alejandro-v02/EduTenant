import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useSesion } from '../../autenticacion/useSesion';
import { listarCursos, obtenerCurso } from '../../servicios/serviciosCursos';
import { listarInstituciones } from '../../servicios/serviciosInstituciones';
import { listarMisMatriculas } from '../../servicios/serviciosMatriculas';
import { listarEstudiantes, listarProfesores } from '../../servicios/serviciosUsuarios';
import { nombreCompleto } from '../../utilidades/formatoUsuario';
import { normalizar } from '../../utilidades/texto';

interface Resultado {
  grupo: string;
  etiqueta: string;
  sublinea?: string;
  ruta: string;
}

async function cargarResultados(rol: string): Promise<Resultado[]> {
  if (rol === 'superadministrador') {
    const instituciones = await listarInstituciones();
    return instituciones.map((i) => ({
      grupo: 'Instituciones',
      etiqueta: i.nombre,
      sublinea: i.municipio ?? undefined,
      ruta: `/superadministrador/instituciones/${i.id}`,
    }));
  }

  if (rol === 'coordinador') {
    const [cursos, profesores, estudiantes] = await Promise.all([listarCursos(), listarProfesores(), listarEstudiantes()]);
    return [
      ...cursos.map((c): Resultado => ({ grupo: 'Cursos', etiqueta: c.nombre, ruta: '/coordinador/cursos' })),
      ...profesores.map((p): Resultado => ({
        grupo: 'Profesores',
        etiqueta: nombreCompleto(p),
        sublinea: p.email,
        ruta: '/coordinador/usuarios',
      })),
      ...estudiantes.map((e): Resultado => ({
        grupo: 'Estudiantes',
        etiqueta: nombreCompleto(e),
        sublinea: e.email,
        ruta: '/coordinador/usuarios',
      })),
    ];
  }

  if (rol === 'profesor') {
    const [cursos, estudiantes] = await Promise.all([listarCursos(), listarEstudiantes()]);
    return [
      ...cursos.map((c): Resultado => ({ grupo: 'Mis cursos', etiqueta: c.nombre, ruta: '/profesor' })),
      ...estudiantes.map((e): Resultado => ({
        grupo: 'Estudiantes',
        etiqueta: nombreCompleto(e),
        sublinea: e.email,
        ruta: '/profesor/estudiantes',
      })),
    ];
  }

  // estudiante
  const matriculas = await listarMisMatriculas();
  const cursos = await Promise.all(matriculas.map((m) => obtenerCurso(m.cursoId)));
  return cursos.map((c): Resultado => ({
    grupo: 'Mis cursos',
    etiqueta: c.nombre,
    ruta: `/estudiante/cursos/${c.id}/material`,
  }));
}

export function BusquedaGeneral() {
  const { usuario } = useSesion();
  const navigate = useNavigate();
  const [consulta, setConsulta] = useState('');
  const [abierto, setAbierto] = useState(false);
  const [datos, setDatos] = useState<Resultado[] | null>(null);
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!usuario) return;
    cargarResultados(usuario.rol)
      .then(setDatos)
      .catch(() => setDatos([]));
    // Sólo se carga una vez por sesión de la página: no depende de lo que el usuario escriba.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario?.rol]);

  useEffect(() => {
    function alHacerClicFuera(evento: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target as Node)) {
        setAbierto(false);
      }
    }
    document.addEventListener('mousedown', alHacerClicFuera);
    return () => document.removeEventListener('mousedown', alHacerClicFuera);
  }, []);

  const consultaNormalizada = normalizar(consulta.trim());
  const coincidencias =
    consultaNormalizada.length >= 2
      ? (datos ?? []).filter((r) => normalizar(r.etiqueta).includes(consultaNormalizada)).slice(0, 18)
      : [];

  const agrupadas = coincidencias.reduce<Record<string, Resultado[]>>((acc, r) => {
    (acc[r.grupo] ??= []).push(r);
    return acc;
  }, {});

  function seleccionar(resultado: Resultado) {
    navigate(resultado.ruta);
    setConsulta('');
    setAbierto(false);
  }

  return (
    <div className="busqueda-general" ref={contenedorRef}>
      <Search size={15} className="busqueda-general__icono" />
      <input
        type="search"
        className="busqueda-general__input"
        placeholder="Buscar…"
        value={consulta}
        onChange={(e) => {
          setConsulta(e.target.value);
          setAbierto(true);
        }}
        onFocus={() => setAbierto(true)}
      />

      {abierto && consultaNormalizada.length >= 2 && (
        <div className="busqueda-general__panel">
          {coincidencias.length === 0 ? (
            <p className="busqueda-general__vacio">Sin resultados para "{consulta.trim()}".</p>
          ) : (
            Object.entries(agrupadas).map(([grupo, items]) => (
              <div key={grupo} className="busqueda-general__grupo">
                <span className="busqueda-general__grupo-titulo">{grupo}</span>
                {items.map((item, indice) => (
                  <button
                    key={`${item.ruta}-${indice}`}
                    type="button"
                    className="busqueda-general__item"
                    onClick={() => seleccionar(item)}
                  >
                    <span className="busqueda-general__item-etiqueta">{item.etiqueta}</span>
                    {item.sublinea && <span className="busqueda-general__item-sublinea">{item.sublinea}</span>}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
