/** Minúsculas y sin tildes, para comparar/filtrar texto ingresado por el usuario. */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}
