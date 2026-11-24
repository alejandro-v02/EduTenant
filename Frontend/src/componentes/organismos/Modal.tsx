import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
  /** Cuando es true, el modal no se puede cerrar (sin X, sin Escape, sin clic afuera) — para pasos obligatorios. */
  bloqueado?: boolean;
  ancho?: 'normal' | 'grande';
}

/** Modal con fondo desenfocado y animación de expansión; cierra con Escape o clic fuera. */
export function Modal({ titulo, onCerrar, children, bloqueado = false, ancho = 'normal' }: ModalProps) {
  useEffect(() => {
    if (bloqueado) return;
    function alPresionarTecla(evento: KeyboardEvent) {
      if (evento.key === 'Escape') onCerrar();
    }
    document.addEventListener('keydown', alPresionarTecla);
    return () => document.removeEventListener('keydown', alPresionarTecla);
  }, [onCerrar, bloqueado]);

  return (
    <div className="modal-fondo" onClick={bloqueado ? undefined : onCerrar}>
      <div
        className={`modal ${ancho === 'grande' ? 'modal--grande' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__cabecera">
          <h2>{titulo}</h2>
          {!bloqueado && (
            <button type="button" className="modal__cerrar" onClick={onCerrar} aria-label="Cerrar">
              <X size={16} />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
