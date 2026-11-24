import { Building2, Map } from 'lucide-react';
import { CampoFormulario } from '../moleculas/CampoFormulario';
import { SelectorBuscable } from './SelectorBuscable';
import { DEPARTAMENTOS_COLOMBIA, obtenerMunicipios } from '../../utilidades/colombia';

interface SelectorUbicacionProps {
  departamento: string;
  municipio: string;
  onCambiarDepartamento: (valor: string) => void;
  onCambiarMunicipio: (valor: string) => void;
  requerido?: boolean;
}

const NOMBRES_DEPARTAMENTOS = DEPARTAMENTOS_COLOMBIA.map((d) => d.departamento);

/** Par departamento/municipio de Colombia: al cambiar el departamento se limpia y filtra el municipio. */
export function SelectorUbicacion({
  departamento,
  municipio,
  onCambiarDepartamento,
  onCambiarMunicipio,
  requerido,
}: SelectorUbicacionProps) {
  const municipios = obtenerMunicipios(departamento);

  return (
    <>
      <CampoFormulario etiqueta="Departamento" icono={Map}>
        <SelectorBuscable
          value={departamento}
          onChange={(valor) => {
            onCambiarDepartamento(valor);
            onCambiarMunicipio('');
          }}
          opciones={NOMBRES_DEPARTAMENTOS}
          placeholder="Selecciona un departamento"
          requerido={requerido}
        />
      </CampoFormulario>
      <CampoFormulario etiqueta="Municipio" icono={Building2}>
        <SelectorBuscable
          value={municipio}
          onChange={onCambiarMunicipio}
          opciones={municipios}
          placeholder={departamento ? 'Selecciona un municipio' : 'Elige primero un departamento'}
          disabled={!departamento}
          requerido={requerido}
        />
      </CampoFormulario>
    </>
  );
}
