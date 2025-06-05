import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/layout.css';

function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h1>Bienvenido a Swapi</h1>
      <p style={{ marginBottom: '20px' }}>Elige una opción:</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button onClick={() => navigate('/registro')}>
          Registrarse
        </button>
        <button onClick={() => navigate('/login')}>
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
}

export default Inicio;
