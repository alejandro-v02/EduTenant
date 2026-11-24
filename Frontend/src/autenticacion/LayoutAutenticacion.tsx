import { Outlet } from 'react-router-dom';

/**
 * Envuelve login / olvidé mi clave / restablecer clave. Al ser un layout persistente
 * (Outlet), la tarjeta sólo se monta —y anima— una vez al entrar al flujo de
 * autenticación; navegar entre esas páginas ya no la remonta ni repite la animación.
 */
export default function LayoutAutenticacion() {
  return (
    <div className="pagina-login">
      <div className="tarjeta-login">
        <div className="marca-login">
          <img src="/img/LogoSkolar.png" alt="" className="logo-login" />
          <h1>Skolar</h1>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
