import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import '../styles/layout.css';

const ADD_USUARIO = gql`
  mutation AddUsuario($nombre: String!, $correo: String!, $contrasena: String!) {
    addUsuario(nombre: $nombre, correo: $correo, contrasena: $contrasena) {
      id_usuario
      correo
    }
  }
`;

function Register() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [addUsuario] = useMutation(ADD_USUARIO);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addUsuario({ variables: { nombre, correo, contrasena } });
      localStorage.setItem('correoVerificacion', data.addUsuario.correo);
      alert('Se ha enviado un código a tu correo. Verifícalo.');
      navigate('/verificar');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="page-container">
      <form className="form-box" onSubmit={handleRegister}>
        <h2>Registro</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo institucional"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;