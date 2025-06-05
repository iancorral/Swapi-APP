import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

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
      navigate('/crear-publicacion'); // Puedes cambiar esta ruta si gustas
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo institucional"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        /><br/>
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        /><br/>
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}

export default Login;