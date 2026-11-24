interface AlertaProps {
  tipo: 'error' | 'exito';
  mensaje: string;
}

export function Alerta({ tipo, mensaje }: AlertaProps) {
  return (
    <div className={`alerta alerta--${tipo}`} role="alert">
      {mensaje}
    </div>
  );
}
