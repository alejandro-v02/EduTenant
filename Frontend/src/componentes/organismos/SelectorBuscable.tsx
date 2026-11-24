import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { normalizar } from '../../utilidades/texto';

interface SelectorBuscableProps {
  value: string;
  onChange: (valor: string) => void;
  opciones: string[];
  placeholder?: string;
  disabled?: boolean;
  requerido?: boolean;
}

const ALTURA_ESTIMADA_PANEL = 300;

/**
 * Reemplaza un `<select>` nativo cuando hay muchas opciones (ej. 125 municipios): el menú nativo
 * no se puede re-estilizar ni controlar su posición, y con listas largas termina cortándose o
 * abriéndose muy hacia arriba/abajo según dónde quede el campo. Este panel mide el espacio
 * disponible al abrirse y decide si desplegarse hacia arriba o hacia abajo, con altura acotada
 * y buscador para no tener que desplazarse manualmente por decenas de opciones.
 */
export function SelectorBuscable({
  value,
  onChange,
  opciones,
  placeholder = 'Selecciona…',
  disabled = false,
  requerido = false,
}: SelectorBuscableProps) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [direccion, setDireccion] = useState<'abajo' | 'arriba'>('abajo');
  const contenedorRef = useRef<HTMLDivElement>(null);
  const buscadorRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function alHacerClicFuera(evento: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target as Node)) {
        setAbierto(false);
      }
    }
    function alPresionarTecla(evento: KeyboardEvent) {
      if (evento.key === 'Escape') setAbierto(false);
    }
    document.addEventListener('mousedown', alHacerClicFuera);
    document.addEventListener('keydown', alPresionarTecla);
    return () => {
      document.removeEventListener('mousedown', alHacerClicFuera);
      document.removeEventListener('keydown', alPresionarTecla);
    };
  }, []);

  useEffect(() => {
    if (abierto) buscadorRef.current?.focus();
  }, [abierto]);

  function alternar() {
    if (disabled) return;
    if (!abierto && contenedorRef.current) {
      const rect = contenedorRef.current.getBoundingClientRect();
      const espacioAbajo = window.innerHeight - rect.bottom;
      const espacioArriba = rect.top;
      setDireccion(espacioAbajo < ALTURA_ESTIMADA_PANEL && espacioArriba > espacioAbajo ? 'arriba' : 'abajo');
    }
    setBusqueda('');
    setAbierto((valor) => !valor);
  }

  function elegir(opcion: string) {
    onChange(opcion);
    setAbierto(false);
  }

  const busquedaNormalizada = normalizar(busqueda.trim());
  const filtradas = busquedaNormalizada
    ? opciones.filter((o) => normalizar(o).includes(busquedaNormalizada))
    : opciones;

  return (
    <div className="selector-buscable" ref={contenedorRef}>
      <button
        type="button"
        className="campo-entrada selector-buscable__disparador"
        onClick={alternar}
        disabled={disabled}
        aria-required={requerido}
      >
        <span className={value ? '' : 'selector-buscable__placeholder'}>{value || placeholder}</span>
        <ChevronDown size={15} className={`selector-buscable__flecha ${abierto ? 'abierta' : ''}`} />
      </button>

      {abierto && (
        <div className={`selector-buscable__panel selector-buscable__panel--${direccion}`}>
          <div className="selector-buscable__buscador">
            <Search size={14} />
            <input
              ref={buscadorRef}
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar…"
            />
          </div>
          <div className="selector-buscable__lista">
            {filtradas.length === 0 ? (
              <p className="selector-buscable__vacio">Sin resultados.</p>
            ) : (
              filtradas.map((opcion) => (
                <button
                  key={opcion}
                  type="button"
                  className={`selector-buscable__opcion ${opcion === value ? 'seleccionada' : ''}`}
                  onClick={() => elegir(opcion)}
                >
                  {opcion}
                  {opcion === value && <Check size={14} />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
