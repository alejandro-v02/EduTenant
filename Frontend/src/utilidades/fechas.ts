export const NOMBRES_MES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

export interface FechaPartes {
  anio: number;
  mes: number;
  dia: number;
}

/** Parsea 'YYYY-MM-DD' sin pasar por Date (evita el corrimiento de un día por zona horaria). */
export function analizarISO(iso: string | null | undefined): FechaPartes | null {
  if (!iso) return null;
  const partes = iso.split('-').map(Number);
  if (partes.length !== 3 || partes.some((n) => Number.isNaN(n))) return null;
  const [anio, mes, dia] = partes;
  return { anio, mes, dia };
}

export function aISO(anio: number, mes: number, dia: number): string {
  return `${String(anio).padStart(4, '0')}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

export function formatearFechaLarga(iso: string): string {
  const fecha = analizarISO(iso);
  if (!fecha) return '';
  return `${fecha.dia} de ${NOMBRES_MES[fecha.mes - 1]} de ${fecha.anio}`;
}

/** Fecha de hoy en horario local (no usar `new Date().toISOString()`, que es UTC y puede desfasarse un día). */
export function hoyISO(): string {
  const hoy = new Date();
  return aISO(hoy.getFullYear(), hoy.getMonth() + 1, hoy.getDate());
}

/** Para marcas de tiempo completas (fecha + hora), ej. "hace 5 min", "hace 3 h". */
export function formatearTiempoRelativo(fechaHoraIso: string): string {
  const segundos = Math.max(0, (Date.now() - new Date(fechaHoraIso).getTime()) / 1000);
  if (segundos < 60) return 'justo ahora';
  const minutos = Math.floor(segundos / 60);
  if (minutos < 60) return `hace ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  if (dias < 7) return `hace ${dias} d`;
  return new Date(fechaHoraIso).toLocaleDateString('es-CO');
}
