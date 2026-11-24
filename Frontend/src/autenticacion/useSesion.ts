import { useContext } from 'react';
import { SesionContext } from './contextoSesion';
import type { SesionContextValor } from './contextoSesion';

export function useSesion(): SesionContextValor {
  const contexto = useContext(SesionContext);
  if (!contexto) {
    throw new Error('useSesion debe usarse dentro de un SesionProvider');
  }
  return contexto;
}
