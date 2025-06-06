import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import '../styles/layout.css';

const VERIFY_CODE = gql`
  mutation VerificarCodigo($correo: String!, $codigo: String!) {
    verificarCodigo(correo: $correo, codigo: $codigo)
  }
`;

function VerifyCode() {
  const [codigo, setCodigo] = useState('');
  const [correo, setCorreo] = useState('');
  const [verificarCodigo] = useMutation(VERIFY_CODE);
  const navigate = useNavigate();

  useEffect(() => {
    const correoGuardado = localStorage.getItem('correoVerificacion');
    if (correoGuardado) {
      setCorreo(correoGuardado);
    } else {
      alert('No se encontró un correo para verificar');
      navigate('/registro');
    }
  }, [navigate]);

  const handleVerificar = async (e) => {
    e.preventDefault();
    try {
      await verificarCodigo({ variables: { correo, codigo } });
      alert('Correo verificado con éxito. Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="page-container">
      <h2>Verificar Código</h2>
      <form className="form-box" onSubmit={handleVerificar}>
        <input type="text" placeholder="Código de verificación" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
        <button type="submit">Verificar</button>
      </form>
    </div>
  );
}

export default VerifyCode;