import axios from 'axios';
import type { AxiosError } from 'axios';
import { notificarExpiracion, obtenerToken } from './tokenStore';

const clienteApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
});

clienteApi.interceptors.request.use((config) => {
  const token = obtenerToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

clienteApi.interceptors.response.use(
  (respuesta) => respuesta,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      notificarExpiracion();
    }
    return Promise.reject(error);
  },
);

interface RespuestaErrorApi {
  message?: string | string[];
}

export function extraerMensajeError(error: unknown, mensajePorDefecto = 'Ocurrió un error inesperado.'): string {
  if (axios.isAxiosError(error)) {
    const datos = error.response?.data as RespuestaErrorApi | undefined;
    if (Array.isArray(datos?.message)) return datos.message.join('. ');
    if (typeof datos?.message === 'string') return datos.message;
  }
  return mensajePorDefecto;
}

export default clienteApi;
