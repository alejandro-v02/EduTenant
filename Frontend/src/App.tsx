import { Navigate, Route, Routes } from 'react-router-dom';
import {
  BookOpen,
  Building2,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react';
import LayoutAutenticacion from './autenticacion/LayoutAutenticacion';
import PaginaLogin from './autenticacion/PaginaLogin';
import PaginaOlvideClave from './autenticacion/PaginaOlvideClave';
import PaginaRestablecerClave from './autenticacion/PaginaRestablecerClave';
import { RolGuard } from './autenticacion/RolGuard';
import { rutaBasePorRol } from './autenticacion/rutasPorRol';
import { useSesion } from './autenticacion/useSesion';
import { LayoutConSidebar } from './componentes/organismos/LayoutConSidebar';
import CrearInstitucion from './rutas/superadministrador/CrearInstitucion';
import DetalleInstitucion from './rutas/superadministrador/DetalleInstitucion';
import ListaInstituciones from './rutas/superadministrador/ListaInstituciones';
import PanelSuperadministrador from './rutas/superadministrador/PanelSuperadministrador';
import ConfiguracionInstitucion from './rutas/coordinador/ConfiguracionInstitucion';
import GestionCursos from './rutas/coordinador/GestionCursos';
import GestionMatriculas from './rutas/coordinador/GestionMatriculas';
import GestionUsuarios from './rutas/coordinador/GestionUsuarios';
import PanelCoordinador from './rutas/coordinador/PanelCoordinador';
import CalendarioAsistencia from './rutas/profesor/CalendarioAsistencia';
import GestionEstudiantes from './rutas/profesor/GestionEstudiantes';
import PanelProfesor from './rutas/profesor/PanelProfesor';
import PublicarMaterial from './rutas/profesor/PublicarMaterial';
import RegistrarNotas from './rutas/profesor/RegistrarNotas';
import TomarAsistencia from './rutas/profesor/TomarAsistencia';
import MiAsistencia from './rutas/estudiante/MiAsistencia';
import MaterialDelCurso from './rutas/estudiante/MaterialDelCurso';
import MisNotas from './rutas/estudiante/MisNotas';
import PanelEstudiante from './rutas/estudiante/PanelEstudiante';

function InicioRedirigido() {
  const { usuario } = useSesion();
  return <Navigate to={usuario ? rutaBasePorRol(usuario.rol) : '/login'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<LayoutAutenticacion />}>
        <Route path="/login" element={<PaginaLogin />} />
        <Route path="/olvide-clave" element={<PaginaOlvideClave />} />
        <Route path="/restablecer-clave" element={<PaginaRestablecerClave />} />
      </Route>
      <Route path="/" element={<InicioRedirigido />} />

      <Route element={<RolGuard rolesPermitidos={['superadministrador']} />}>
        <Route
          path="/superadministrador"
          element={
            <LayoutConSidebar
              tituloSeccion="Superadministrador"
              enlaces={[
                { to: '/superadministrador', etiqueta: 'Panel', icono: LayoutDashboard, fin: true },
                { to: '/superadministrador/instituciones', etiqueta: 'Instituciones', icono: Building2 },
              ]}
            />
          }
        >
          <Route index element={<PanelSuperadministrador />} />
          <Route path="instituciones" element={<ListaInstituciones />} />
          <Route path="instituciones/nueva" element={<CrearInstitucion />} />
          <Route path="instituciones/:id" element={<DetalleInstitucion />} />
        </Route>
      </Route>

      <Route element={<RolGuard rolesPermitidos={['coordinador']} />}>
        <Route
          path="/coordinador"
          element={
            <LayoutConSidebar
              tituloSeccion="Coordinador"
              enlaces={[
                { to: '/coordinador', etiqueta: 'Panel', icono: LayoutDashboard, fin: true },
                { to: '/coordinador/cursos', etiqueta: 'Cursos', icono: BookOpen },
                { to: '/coordinador/usuarios', etiqueta: 'Usuarios', icono: Users },
                { to: '/coordinador/matriculas', etiqueta: 'Matrículas', icono: ClipboardList },
                { to: '/coordinador/institucion', etiqueta: 'Mi institución', icono: Settings },
              ]}
            />
          }
        >
          <Route index element={<PanelCoordinador />} />
          <Route path="cursos" element={<GestionCursos />} />
          <Route path="usuarios" element={<GestionUsuarios />} />
          <Route path="matriculas" element={<GestionMatriculas />} />
          <Route path="institucion" element={<ConfiguracionInstitucion />} />
        </Route>
      </Route>

      <Route element={<RolGuard rolesPermitidos={['profesor']} />}>
        <Route
          path="/profesor"
          element={
            <LayoutConSidebar
              tituloSeccion="Profesor"
              enlaces={[
                { to: '/profesor', etiqueta: 'Mis cursos', icono: BookOpen, fin: true },
                { to: '/profesor/estudiantes', etiqueta: 'Mis estudiantes', icono: Users },
                { to: '/profesor/calendario', etiqueta: 'Calendario', icono: CalendarDays },
              ]}
            />
          }
        >
          <Route index element={<PanelProfesor />} />
          <Route path="estudiantes" element={<GestionEstudiantes />} />
          <Route path="calendario" element={<CalendarioAsistencia />} />
          <Route path="cursos/:cursoId/asistencia" element={<TomarAsistencia />} />
          <Route path="cursos/:cursoId/notas" element={<RegistrarNotas />} />
          <Route path="cursos/:cursoId/material" element={<PublicarMaterial />} />
        </Route>
      </Route>

      <Route element={<RolGuard rolesPermitidos={['estudiante']} />}>
        <Route
          path="/estudiante"
          element={
            <LayoutConSidebar
              tituloSeccion="Estudiante"
              enlaces={[
                { to: '/estudiante', etiqueta: 'Mis cursos', icono: BookOpen, fin: true },
                { to: '/estudiante/notas', etiqueta: 'Mis notas', icono: GraduationCap },
                { to: '/estudiante/asistencia', etiqueta: 'Mi asistencia', icono: CalendarCheck },
              ]}
            />
          }
        >
          <Route index element={<PanelEstudiante />} />
          <Route path="notas" element={<MisNotas />} />
          <Route path="asistencia" element={<MiAsistencia />} />
          <Route path="cursos/:cursoId/material" element={<MaterialDelCurso />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
