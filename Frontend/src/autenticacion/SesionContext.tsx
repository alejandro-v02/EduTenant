import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { SesionContext } from './contextoSesion';
import type { SesionContextValor } from './contextoSesion';
import { iniciarSesion as iniciarSesionApi } from '../servicios/serviciosAuth';
import { establecerToken, registrarManejadorExpiracion } from '../servicios/tokenStore';
import type { UsuarioSesion } from '../tipos/tipos';

/**
 * El token vive únicamente en memoria (estado de React + tokenStore para el interceptor de
 * Axios). No se persiste en localStorage/sessionStorage por seguridad: al recargar la página
 * la sesión se pierde intencionalmente y el usuario debe autenticarse de nuevo.
 */
export function SesionProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const logout = useCallback(() => {
    setUsuario(null);
    setToken(null);
    establecerToken(null);
  }, []);

  useEffect(() => {
    registrarManejadorExpiracion(logout);
  }, [logout]);

  const login = useCallback(async (email: string, clave: string) => {
    setCargando(true);
    try {
      const respuesta = await iniciarSesionApi(email, clave);
      setUsuario(respuesta.usuario);
      setToken(respuesta.tokenAcceso);
      establecerToken(respuesta.tokenAcceso);
      return respuesta.usuario;
    } finally {
      setCargando(false);
    }
  }, []);

  const actualizarUsuarioSesion = useCallback((cambios: Partial<UsuarioSesion>) => {
    setUsuario((previo) => (previo ? { ...previo, ...cambios } : previo));
  }, []);

  const valor = useMemo<SesionContextValor>(
    () => ({
      usuario,
      rol: usuario?.rol ?? null,
      institucionId: usuario?.institucionId ?? null,
      token,
      cargando,
      login,
      logout,
      actualizarUsuarioSesion,
    }),
    [usuario, token, cargando, login, logout, actualizarUsuarioSesion],
  );

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}
