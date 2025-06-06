import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import '../styles/layout.css';

const LOGIN_MUTATION = gql`
  mutation Login($correo: String!, $contrasena: String!) {
    login(correo: $correo, contrasena: $contrasena) {
      token
    }
  }
`;

function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [login] = useMutation(LOGIN_MUTATION);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { correo, contrasena } });
      localStorage.setItem('token', data.login.token);
      alert('¡Login exitoso!');
      navigate('/anuncios');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="page-container">
      <h2>Iniciar Sesión</h2>
      <form className="form-box" onSubmit={handleLogin}>
        <input type="email" placeholder="Correo institucional" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}

export default Login;