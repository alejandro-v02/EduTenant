import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SesionProvider } from './autenticacion/SesionContext';
import { Notificaciones } from './componentes/organismos/Notificaciones';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SesionProvider>
        <App />
        <Notificaciones />
      </SesionProvider>
    </BrowserRouter>
  </StrictMode>,
);
