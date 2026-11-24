import { useCallback, useEffect, useState } from 'react';
import { extraerMensajeError } from '../servicios/clienteApi';

interface EstadoPeticion<T> {
  datos: T | null;
  cargando: boolean;
  error: string | null;
}

/** Ejecuta `peticion` al montar y cada vez que cambian `dependencias`; expone `recargar` para repetirla manualmente. */
export function usePeticion<T>(peticion: () => Promise<T>, dependencias: unknown[] = []) {
  const [estado, setEstado] = useState<EstadoPeticion<T>>({ datos: null, cargando: true, error: null });

  const ejecutar = useCallback(() => {
    setEstado((previo) => ({ ...previo, cargando: true, error: null }));
    peticion()
      .then((datos) => setEstado({ datos, cargando: false, error: null }))
      .catch((error: unknown) => setEstado({ datos: null, cargando: false, error: extraerMensajeError(error) }));
    // eslint-disable-next-line react-hooks/use-memo, react-hooks/exhaustive-deps -- deps dinámicas provistas por quien llama al hook
  }, dependencias);

  useEffect(() => {
    ejecutar();
  }, [ejecutar]);

  return { ...estado, recargar: ejecutar };
}
